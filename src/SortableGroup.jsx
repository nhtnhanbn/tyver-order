import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { verticalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";

function SortableGroup({ children, id, items }) {
	const { setNodeRef } = useDroppable({ id: id });
	const [ collapsed, setCollapsed ] = useState(false);

	return (
		<SortableContext
			id={id}
			items={items}
			strategy={verticalListSortingStrategy}
		>
			<div
				ref={setNodeRef}
				style={
					{
						background: "red",
						margin: 10,
						width: 100,
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
					{id}
					<span onClick={
						() => {
							setCollapsed(!collapsed);
						}
					}>
						{ collapsed ? "+" : "-" }
					</span>
				</div>
				{
					children(collapsed)
				}
			</div>
		</SortableContext>
	);
}

export { SortableGroup };