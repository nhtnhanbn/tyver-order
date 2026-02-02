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
// import "./App.css";

function debounce(fn, delay) {
	let timeout;
	return function (...args) {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			fn.apply(this, args);
		}, delay);
	}
}

function App() {
	const [candidateGroups, setCandidateGroups] = useState({
		"A Droppable": [1, 2, 3],
		"B Droppable": [4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
	});
	const [groupColumns, setGroupColumns] = useState({
		active: [],
		unused: ["A", "B"]
	});

	const debounceHandleDragOver = useCallback(
		debounce((active, over, groupColumns, candidateGroups) => {
			if (over === null) {
				return;
			}
			
			const activeContainer = findContainer(active.id, groupColumns, candidateGroups);
			const overContainer = findContainer(over.id, groupColumns, candidateGroups);
			console.log(active.id, over.id, activeContainer, overContainer);

			if (activeContainer === overContainer) {
				return;
			}

			if (
				droppableId(active.id) in candidateGroups &&
				!(overContainer in groupColumns)
			) {
				console.log("pass");
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
					if (!newGroupColumns[overContainer].includes(active.id)) {
						newGroupColumns[overContainer] = [...newGroupColumns[overContainer], active.id];
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
					if (!newCandidateGroups[overContainer].includes(active.id)) {
						newCandidateGroups[overContainer] = [...newCandidateGroups[overContainer], active.id];
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
							(collapsed) => {
								return (
										candidateGroups[droppableGroupId].map((candidateId) => {
											return <SortableCandidate key={candidateId} id={candidateId} collapsed={collapsed} />;
										})
								);
							}
						}
					</SortableGroup>
				);
			} else {
				return (
					<SortableCandidate key={groupId} id={groupId} collapsed={false} />
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

		if (droppableId(active.id) in candidateGroups) {
			return detectionAlgorithm({
				active,
				droppableContainers: droppableContainers.filter((container) => {
					return findContainer(container.id, groupColumns, candidateGroups) in groupColumns;
				}),
				...args
			});
		}
		
		return detectionAlgorithm({
			active,
			droppableContainers,
			...args
		});
	}

	return (
		<>
			<DndContext
				sensors={
					useSensors(
						useSensor(PointerSensor),
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
						{ display: "flex", flexDirection: "row", alignItems: "start" }
					}
				>
					<SortableColumn id="unused" items={groupColumns.unused}>
						{displayGroups(groupColumns.unused)}
					</SortableColumn>
				</div>
			</DndContext>
			<button
				onClick={
					() => {
						console.log(candidateGroups);
					}
				}
			>Submit</button>
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
		console.log(groupColumns.unused, candidateGroups["A Droppable"], candidateGroups["B Droppable"]);
		debounceHandleDragOver(active, over, groupColumns, candidateGroups);
	}

	function handleDragEnd({ active, over }) {
		if (over === null) {
			return;
		}

		const activeContainer = findContainer(active.id, groupColumns, candidateGroups);
		const overContainer = findContainer(over.id, groupColumns, candidateGroups);

		console.log(active.id, over.id, activeContainer, overContainer);

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
