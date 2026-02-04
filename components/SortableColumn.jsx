import { useDroppable } from "@dnd-kit/core";
import { verticalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";

function SortableColumn({ children, id, items, backgroundColor, borderValues }) {
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
						backgroundColor: backgroundColor,
						width: "45vw",
						maxWidth: 700,
						paddingTop: 10,
						paddingBottom: "2em",
						...borderValues
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