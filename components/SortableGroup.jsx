import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { verticalListSortingStrategy, SortableContext, useSortable } from "@dnd-kit/sortable";
import { droppableId } from "./droppableId";

function SortableGroup({ children, id, items }) {
	const {
		attributes,
		isDragging,
		listeners,
		setNodeRef: setSortableNodeRef,
		transform,
		transition,
	} = useSortable({ id: id });
	const { setNodeRef: setDroppableNodeRef } = useDroppable({ id: droppableId(id) });

	return (
		<details
			ref={setSortableNodeRef}
			style={
				{
					transform: CSS.Translate.toString(transform),
					transition,
					background: "silver",
					margin: 10,
					padding: 10,
					height: "auto",
					position: isDragging && "relative",
					zIndex: 1
				}
			}
			{...attributes}
			{...listeners}
		>
			<summary
				style={
					{
						textAlign: "left"
					}
				}
			>{id}</summary>
			<SortableContext
				items={items}
				strategy={verticalListSortingStrategy}
			>
				<div
					ref={setDroppableNodeRef}
					style={
						{
							textAlign: "center",
							minHeight: "4em",
							padding: 10,
							marginTop: 10
						}
					}
				>
					{children}
				</div>
			</SortableContext>
		</details>
	);
}

export { SortableGroup };