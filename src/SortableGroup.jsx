import { useDroppable } from "@dnd-kit/core";
import { verticalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";

function SortableGroup({ children, id, items }) {
	const { setNodeRef } = useDroppable({ id: id });
	const style = {
		border: "solid"
	};
	return (
		<SortableContext
			items={items}
			strategy={verticalListSortingStrategy}
		>
			<div ref={setNodeRef} style={style}>
				{children}
			</div>
		</SortableContext>
	);
}

export { SortableGroup };