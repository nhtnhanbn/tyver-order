import { useDroppable } from "@dnd-kit/core";
import { verticalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";

function SortableColumn({ children, id, items }) {
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
						background: "aqua",
						width: "45vw",
						maxWidth: 700,
						paddingBottom: "2em"
					}
				}
			>
				{id}
				{children}
			</div>
		</SortableContext>
	);
}

export { SortableColumn };