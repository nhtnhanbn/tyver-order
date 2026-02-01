import { useState } from "react"
import {
	DndContext,
	closestCorners,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors
} from '@dnd-kit/core';
import {
	arrayMove,
	sortableKeyboardCoordinates
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
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
				collisionDetection={closestCorners}
				onDragEnd={handleDragEnd}
				onDragOver={handleDragOver}
				modifiers={[restrictToVerticalAxis]}
			>
				{
					Object.entries(itemTree).map(([key, items]) => {
						return (
							<SortableGroup key={key} id={key} items={items}>
								{
									items.map((id) => {
										return <SortableCandidate key={id} id={id} />;
									})
								}
							</SortableGroup>
						);
					})
				}
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
		return Object.keys(itemTree).find((key) => {
			return itemTree[key].includes(itemId);
		});
	}

	function handleDragOver({ active, over }) {
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
