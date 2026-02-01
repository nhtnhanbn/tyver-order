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
// import "./App.css";

function App() {
	const [itemTree, setItemTree] = useState({
		A: [1, 2, 3],
		B: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
	});
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	return (
		<>
			<DndContext
				sensors={sensors}
				onDragEnd={handleDragEnd}
				onDragOver={handleDragOver}
			>
				<div 
					style={
						{ display: "flex", flexDirection: "row", alignItems: "start" }
					}
				>
					{
						Object.entries(itemTree).map(([key, items]) => {
							return (
								<SortableGroup key={key} id={key} items={items}>
									{
										(collapsed) => {
											return (
													items.map((id) => {
														return <SortableCandidate key={id} id={id} collapsed={collapsed} />;
													})
											);
										}
									}
								</SortableGroup>
							);
						})
					}
				</div>
			</DndContext>
			<button
				onClick={
					() => {
						console.log(itemTree);
					}
				}
			>Submit</button>
		</>
	);

	function findGroupKey(itemId) {
		if (itemId in itemTree) {
			return itemId;
		}
		
		return Object.keys(itemTree).find((key) => {
			return itemTree[key].includes(itemId);
		});
	}

	function handleDragOver({ active, over }) {
		if (over === null) {
			return;
		}
		
		const activeGroup = findGroupKey(active.id);
		const overGroup = findGroupKey(over.id);

		console.log(activeGroup, overGroup);

		if (activeGroup !== overGroup) {
			setItemTree((itemTree) => {
				return {
					...itemTree,
					[activeGroup]: itemTree[activeGroup].filter((item) => {
						return item !== active.id
					}),
					[overGroup]: [...itemTree[overGroup], active.id]
				};
			});
		}
	}

	function handleDragEnd({ active, over }) {
		if (over === null) {
			return;
		}

		const activeGroup = findGroupKey(active.id);
		const overGroup = findGroupKey(over.id);

		if (active.id !== over.id && activeGroup === overGroup) {
			setItemTree((itemTree) => {
				const items = itemTree[overGroup];
				const oldIndex = items.indexOf(active.id);
				const newIndex = items.indexOf(over.id);

				return {
					...itemTree,
					[overGroup]: arrayMove(items, oldIndex, newIndex)
				}
			});
		}
	}
}

export { App };
