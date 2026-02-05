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
			<div style={
				{
					display: "flex",
					justifyContent: "space-between",
					textAlign: "left"
				}
			}>
				{id}
				<div
					onClick={
						() => {
							setCollapsed(!collapsed);
						}
					}
					style={
						{
							cursor: "pointer",
							flex: "0 0 1em",
							textAlign: "center"
						}
					}
				>
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
			}
		</div>
	);
}

export { SortableGroup };