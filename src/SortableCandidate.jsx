import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableCandidate({ id }) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
	} = useSortable({ id: id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		touchAction: "none"
	};

	return (
		<div ref={setNodeRef} style={style} {...attributes} {...listeners}>
			{id}
		</div>
	);
}

export { SortableCandidate };