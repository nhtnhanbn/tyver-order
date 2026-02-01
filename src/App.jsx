import { useState } from "react"
import {
	DndContext,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors
} from '@dnd-kit/core';
import {
	arrayMove,
	sortableKeyboardCoordinates
} from "@dnd-kit/sortable";
import { SortableCandidate } from "./SortableCandidate";
import { SortableGroup } from "./SortableGroup";
import { SortableColumn } from "./SortableColumn";
// import "./App.css";

function App() {
	const [candidateGroups, setCandidateGroups] = useState({
		A: [1, 2, 3],
		B: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
	});
	const [groupColumns, setGroupColumns] = useState({
		active: [],
		unused: ["A", "B"]
	});

	function displayGroups(groups) {
		return groups.map((groupId) => {
			if (groupId in candidateGroups) {
				return (
					<SortableGroup key={groupId} id={groupId} items={candidateGroups[groupId]}>
						{
							(collapsed) => {
								return (
										candidateGroups[groupId].map((candidateId) => {
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

	function findContainer(id) {
		if (id in groupColumns) {
			return id;
		} else {
			const column = Object.keys(groupColumns).find((key) => {
				return groupColumns[key].includes(id);
			});

			if (column === undefined) {
				return Object.keys(candidateGroups).find((key) => {
					return candidateGroups[key].includes(id);
				});
			} else {
				return column;
			}
		}
	}

	function handleDragOver({ active, over }) {
		if (over === null) {
			return;
		}
		
		const activeContainer = findContainer(active.id);
		const overContainer = findContainer(over.id);

		if (activeContainer !== overContainer) {
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
		}
	}

	function handleDragEnd({ active, over }) {
		if (over === null) {
			return;
		}

		const activeContainer = findContainer(active.id);
		const overContainer = findContainer(over.id);

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
