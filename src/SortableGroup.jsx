import { useState } from "react";
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
	const [ collapsed, setCollapsed ] = useState(true);

	return (
		<div
			ref={setSortableNodeRef}
			style={
				{
					transform: CSS.Translate.toString(transform),
					transition,
					background: "red",
					margin: 10,
					padding: 10,
					height: "auto",
					position: isDragging && "relative",
					zIndex: 1
				}
			}
		>
			<div style={
				{
					display: "flex",
					justifyContent: "space-between"
				}
			}>
				<button
					style={
						{
							touchAction: "none",
						}
					}
					{...attributes}
					{...listeners}
				>D</button>
				{id}
				<div onClick={
					() => {
						setCollapsed(!collapsed);
					}
				}>
					{ collapsed ? "+" : "-" }
				</div>
			</div>

			{
				!collapsed &&
				<SortableContext
					items={items}
					strategy={verticalListSortingStrategy}
				>
					<div
						ref={setDroppableNodeRef}
						style={
							{
								background: "yellow",
								textAlign: "center",
								minHeight: "4em",
								padding: "10px"
							}
						}
					>
						{children}
					</div>
				</SortableContext>
			}
		</div>
	);
}

export { SortableGroup };