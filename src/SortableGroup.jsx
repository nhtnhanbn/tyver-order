import { useDroppable } from "@dnd-kit/core";
import { verticalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";

function SortableGroup({ children, id, items }) {
	const { setNodeRef } = useDroppable({ id: id });
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
						padding: 10,
						margin: 10,
						width: 100
					}
				}
			>
				{id}
				{children}
			</div>
		</SortableContext>
	);
}

export { SortableGroup };