import { useState, useCallback } from "react"
import {
	DndContext,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	rectIntersection
} from '@dnd-kit/core';
import {
	arrayMove,
	sortableKeyboardCoordinates
} from "@dnd-kit/sortable";
import { SortableCandidate } from "./SortableCandidate";
import { SortableGroup } from "./SortableGroup";
import { SortableColumn } from "./SortableColumn";
import { droppableId } from "./droppableId";
import "./Generator.css";

function debounce(fn, delay) {
	let timeout;
	return function (...args) {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			fn.apply(this, args);
		}, delay);
	}
}

function Generator({ configuration }) {
	const groups = [], rowSplit = [], columnSplit = {};

	const initialUnrankedCandidates = [];

	let validConfiguration = true;
	try {
		groups.push(...Object.keys(configuration.groups));
		initialUnrankedCandidates.push(...groups);

		if ("groupsPerRow" in configuration) {
			const ungroupedBoxIncrement = (configuration.ungrouped.length > 0 ? 1 : 0);
			for (let i = 0; i < groups.length + ungroupedBoxIncrement; i += configuration.groupsPerRow) {
				rowSplit.push(groups.slice(i, i+configuration.groupsPerRow));
			}
		} else {
			rowSplit.push([...groups]);
		}

		for (const groupId of groups) {
			const candidates = configuration.groups[groupId];
			if ("candidatesPerColumn" in configuration) {
				columnSplit[groupId] = [];
				for (let i = 0; i < candidates.length; i += configuration.candidatesPerColumn) {
					columnSplit[groupId].push(candidates.slice(i, i+configuration.candidatesPerColumn));
				}
			} else {
				columnSplit[groupId] = [candidates];
			}
		}
		
		if (configuration.ungrouped.length > 0) {
			const groupId = "";

			rowSplit[rowSplit.length-1].push(groupId);

			const candidates = configuration.ungrouped;
			if ("candidatesPerColumn" in configuration) {
				columnSplit[groupId] = [];
				for (let i = 0; i < candidates.length; i += configuration.candidatesPerColumn) {
					columnSplit[groupId].push(candidates.slice(i, i+configuration.candidatesPerColumn));
				}
			} else {
				columnSplit[groupId] = [candidates];
			}

			initialUnrankedCandidates.push(...candidates);
		}
	} catch {
		validConfiguration = false;
		alert("Invalid configuration");
	}

	const [candidateGroups, setCandidateGroups] = useState(() => {
		const initialCandidateGroups = {};
		for (const groupId of groups) {
			initialCandidateGroups[droppableId(groupId)] = configuration.groups[groupId];
		}
		return initialCandidateGroups;
	});
	const [groupColumns, setGroupColumns] = useState({
		"Preference order": [],
		"Unranked candidates": [...initialUnrankedCandidates]
	});

	const debounceHandleDragOver = useCallback(
		debounce((active, over, groupColumns, candidateGroups) => {
			if (over === null) {
				return;
			}
			
			const activeContainer = findContainer(active.id, groupColumns, candidateGroups);
			const overContainer = findContainer(over.id, groupColumns, candidateGroups);

			if (activeContainer === overContainer) {
				return;
			}

			if (
				droppableId(active.id) in candidateGroups &&
				!(overContainer in groupColumns)
			) {
				return;
			}

			setGroupColumns((groupColumns) => {
				const newGroupColumns = { ...groupColumns };

				if (activeContainer in groupColumns) {
					newGroupColumns[activeContainer] = newGroupColumns[activeContainer].filter((item) => {
						return item !== active.id;
					});
				}

				if (overContainer in groupColumns) {
					const overItems = newGroupColumns[overContainer];
					if (!overItems.includes(active.id)) {
						newGroupColumns[overContainer] = [...overItems, active.id];
						if (over.id !== overContainer) { // not root droppable
							const items = newGroupColumns[overContainer];
							const oldIndex = items.length - 1;
							const newIndex = items.indexOf(over.id);
							newGroupColumns[overContainer] = arrayMove(items, oldIndex, newIndex);
						}
					}
				}

				return newGroupColumns;
			});

			setCandidateGroups((candidateGroups) => {
				const newCandidateGroups = { ...candidateGroups };

				if (!(activeContainer in groupColumns)) {
					newCandidateGroups[activeContainer] = newCandidateGroups[activeContainer].filter((item) => {
						return item !== active.id;
					});
				}
				if (!(overContainer in groupColumns)) {
					const overItems = newCandidateGroups[overContainer];
					if (!overItems.includes(active.id)) {
						newCandidateGroups[overContainer] = [...newCandidateGroups[overContainer], active.id];
						if (over.id !== overContainer) { // not root droppable
							const items = newCandidateGroups[overContainer];
							const oldIndex = items.length - 1;
							const newIndex = items.indexOf(over.id);
							newCandidateGroups[overContainer] = arrayMove(items, oldIndex, newIndex);
						}
					}
				}

				return newCandidateGroups;
			});
		}, 100),
		[]
	);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: { distance: 0.01 }
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	if (!validConfiguration) {
		return;
	}

	function displayGroups(groups) {
		return groups.map((groupId) => {
			const droppableGroupId = droppableId(groupId);
			if (droppableGroupId in candidateGroups) {
				return (
					<SortableGroup key={groupId} id={groupId} items={candidateGroups[droppableGroupId]}>
						{
							candidateGroups[droppableGroupId].map((candidateId) => {
								return <SortableCandidate key={candidateId} id={candidateId} />;
							})
						}
					</SortableGroup>
				);
			} else {
				return (
					<SortableCandidate key={groupId} id={groupId} />
				);
			}
		});
	}

	function prioritisedCollisionDetection({
		active,
		droppableContainers,
		...args
	}) {
		const detectionAlgorithm = rectIntersection;

		// const activeContainer = findContainer(active.id, groupColumns, candidateGroups);
		// droppableContainers = droppableContainers.filter((container) => {
		// 	return container.id !== activeContainer;
		// });

		if (droppableId(active.id) in candidateGroups) {
			const filteredContainers = droppableContainers.filter((container) => {
				return findContainer(container.id, groupColumns, candidateGroups) in groupColumns;
			});

			const candidateCollisions = detectionAlgorithm({
				active: active,
				droppableContainers: filteredContainers.filter((container) => {
					return !(container.id in groupColumns) && !(droppableId(container.id) in candidateGroups);
				}),
				...args
			});

			if (candidateCollisions.length > 0) {
				return candidateCollisions;
			}

			const groupCollisions = detectionAlgorithm({
				active: active,
				droppableContainers: filteredContainers.filter((container) => {
					return (droppableId(container.id) in candidateGroups) && (container.id !== active.id);
				}),
				...args
			});

			if (groupCollisions.length > 0) {
				return groupCollisions;
			}

			return detectionAlgorithm({
				active: active,
				droppableContainers: filteredContainers,
				...args
			});
		}
		
		return detectionAlgorithm({
			active: active,
			droppableContainers: droppableContainers,
			...args
		});
	}

	const preferences = {};
	let preferenceCount = 0;
	for (const item of groupColumns["Preference order"]) {
		if (droppableId(item) in candidateGroups) {
			for (const candidate of candidateGroups[droppableId(item)]) {
				preferenceCount++;
				preferences[candidate] = preferenceCount;
			}
		} else {
			preferenceCount++;
			preferences[item] = preferenceCount;
		}
	}

	let formality;
	if (preferenceCount >= configuration.minFormal) {
		formality = "FORMAL";
	} else if (preferenceCount >= configuration.minSaved) {
		formality = "SAVED";
	} else {
		formality = "INFORMAL";
	}

	return (
		<>
			<DndContext
				sensors={sensors}
				onDragEnd={handleDragEnd}
				onDragOver={handleDragOver}
				collisionDetection={prioritisedCollisionDetection}
			>
				<div 
					style={
						{
							display: "flex",
							flexDirection: "row",
							alignItems: "stretch",
							justifyContent: "center",
							gap: 10
						}
					}
				>
					<SortableColumn
						id="Preference order"
						items={groupColumns["Preference order"]}
						borderValues={
							{
								borderStyle: formality === "SAVED" ? "double" : "solid",
								borderWidth: "0.2em",
								borderColor: formality === "FORMAL" ? "green" : "red"
							}
						}
					>
						{displayGroups(groupColumns["Preference order"])}
					</SortableColumn>
					<SortableColumn
						id="Unranked candidates"
						items={groupColumns["Unranked candidates"]}
						backgroundColor="grey"
						borderValues={
							{
								border: "solid grey"
							}
						}
					>
						{displayGroups(groupColumns["Unranked candidates"])}
					</SortableColumn>
				</div>
			</DndContext>
			<p>Generated ballot guide below! Use the print dialog in landscape layout to print a paper copy or save a PDF to your device - you may need to decrease the scale or increase the paper size to fit the whole ballot guide.</p>
			<button
				onClick={print}
				disabled={formality==="INFORMAL"}
			>
				Save or Print
			</button>
			{
				formality === "INFORMAL" &&
				<p
					style={
						{
							color: "red",
							fontWeight: "bold"
						}
					}
				>
					Fewer than {configuration.minFormal} preferences. Ballot is informal and will not be counted.
				</p>
			}
			{
				formality === "SAVED" &&
				<p
					style={
						{
							color: "red"
						}
					}
				>
					Fewer than {configuration.minFormal} preferences. Ballot is informal.
				</p>
			}
			{
				formality === "FORMAL" &&
				<p
					style={
						{
							color: "green"
						}
					}
				>
					Ballot is formal.
				</p>
			}
			<div className="ballot">
				<table>
					<tbody>
						{
							rowSplit.map((ballotRow, index) => {
								return (
									<tr key={index}>
										{
											ballotRow.map((groupId) => {
												return (
													<td key={groupId}>
														<b>{groupId}</b>
														<div className="group-box">
															{
																columnSplit[groupId].map((column, columnIndex) => {
																	return (
																		<div key={columnIndex}>
																			{
																				column.map((candidateId) => {
																					return (
																						<div className="candidate-row" key={candidateId}>
																							<div className="square">{preferences[candidateId]}</div>
																							<div className="candidate-name">{candidateId}</div>
																						</div>
																					);
																				})
																			}
																		</div>
																	);
																})
															}
														</div>
													</td>
												);
											})
										}
									</tr>
								);
							})
						}
					</tbody>
				</table>
			</div>
		</>
	);

	function findContainer(id, groupColumns, candidateGroups) {
		if (id in groupColumns) {
			return id;
		}

		const column = Object.keys(groupColumns).find((key) => {
			return groupColumns[key].includes(id);
		});

		if (column !== undefined) {
			return column;
		}

		if (id in candidateGroups) {
			return id;
		}

		return Object.keys(candidateGroups).find((key) => {
			return candidateGroups[key].includes(id);
		});
	}

	function handleDragOver({ active, over }) {
		debounceHandleDragOver(active, over, groupColumns, candidateGroups);
	}

	function handleDragEnd({ active, over }) {
		if (over === null) {
			return;
		}

		const activeContainer = findContainer(active.id, groupColumns, candidateGroups);
		const overContainer = findContainer(over.id, groupColumns, candidateGroups);

		if (active.id !== over.id && activeContainer === overContainer) {
			if (overContainer in groupColumns) {
				setGroupColumns((groupColumns) => {
					const items = groupColumns[overContainer];
					const oldIndex = items.indexOf(active.id);
					const newIndex = items.indexOf(over.id);

					return {
						...groupColumns,
						[overContainer]: arrayMove(items, oldIndex, newIndex)
					}
				});
			} else {
				setCandidateGroups((candidateGroups) => {
					const items = candidateGroups[overContainer];
					const oldIndex = items.indexOf(active.id);
					const newIndex = items.indexOf(over.id);

					return {
						...candidateGroups,
						[overContainer]: arrayMove(items, oldIndex, newIndex)
					}
				});
			}
		}
	}
}

export { Generator };
