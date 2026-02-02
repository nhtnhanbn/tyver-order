import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { verticalListSortingStrategy, SortableContext, useSortable } from "@dnd-kit/sortable";

function SortableGroup({ children, id, items }) {
	const {
		attributes,
		listeners,
		setNodeRef: setSortableNodeRef,
		transform,
		transition,
	} = useSortable({ id: id });
	const { setNodeRef: setDroppableNodeRef } = useDroppable({ id: id });
	const [ collapsed, setCollapsed ] = useState(true);

	return (
		<div
			ref={setSortableNodeRef}
			style={
				{
					transform: CSS.Transform.toString(transform),
					transition,
					background: "red",
					margin: 10,
					height: "auto"
				}
			}
		>
			<div style={
				{
					margin: 10,
					display: "flex",
					justifyContent: "space-between"
				}
			}>
				<button {...attributes} {...listeners}>D</button>
				{id}
				<div onClick={
					() => {
						setCollapsed(!collapsed);
					}
				}>
					{ collapsed ? "+" : "-" }
				</div>
			</div>
			<SortableContext
				id={id}
				items={items}
				strategy={verticalListSortingStrategy}
			>
				<div
					ref={setDroppableNodeRef}
				>
					{children(collapsed)}
				</div>
			</SortableContext>
		</div>
	);
}

export { SortableGroup };