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
import viclegcogroups from "./viclegcogroups.json";
import "./App.css";

function debounce(fn, delay) {
	let timeout;
	return function (...args) {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			fn.apply(this, args);
		}, delay);
	}
}

const initialCandidateGroups = {};
const groups = Object.keys(viclegcogroups.data);
for (const groupId of groups) {
	initialCandidateGroups[droppableId(groupId)] = viclegcogroups.data[groupId];
}

const ballotRows = [];
for (let i = 0; i < groups.length; i += viclegcogroups.groupsPerRow) {
	ballotRows.push(groups.slice(i, i+viclegcogroups.groupsPerRow));
}

function App() {
	const [candidateGroups, setCandidateGroups] = useState(initialCandidateGroups);
	const [groupColumns, setGroupColumns] = useState({
		active: [],
		unused: groups
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
	let counter = 1;
	for (const item of groupColumns.active) {
		if (droppableId(item) in candidateGroups) {
			for (const candidate of candidateGroups[droppableId(item)]) {
				preferences[candidate] = counter;
				counter++;
			}
		} else {
			preferences[item] = counter;
			counter++;
		}
	}

	return (
		<>
			<DndContext
				sensors={
					useSensors(
						useSensor(PointerSensor, {
							activationConstraint: { distance: 0.01 }
						}),
						useSensor(KeyboardSensor, {
							coordinateGetter: sortableKeyboardCoordinates,
						})
					)
				}
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
					<SortableColumn id="active" items={groupColumns.active}>
						{displayGroups(groupColumns.active)}
					</SortableColumn>
					<SortableColumn id="unused" items={groupColumns.unused}>
						{displayGroups(groupColumns.unused)}
					</SortableColumn>
				</div>
			</DndContext>
			<table>
				<tbody>
					{
						ballotRows.map((ballotRow, index) => {
							return (
								<tr key={index}>
									{
										ballotRow.map((groupId) => {
											return (
												<td key={groupId}>
													<b>{groupId}</b>
													{
														viclegcogroups.data[groupId].map((candidateId) => {
															return (
																<div className="row" key={candidateId}>
																	<div className="square">{preferences[candidateId]}</div>
																	<div className="candidateName">{candidateId}</div>
																</div>
															);
														})
													}
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
			<button
				onClick={print}
			>Save or Print</button>
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

export { App };
