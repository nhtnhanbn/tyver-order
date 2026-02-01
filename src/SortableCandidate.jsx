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

	return (
		<div
			ref={setNodeRef}
			style={
				{
				transform: CSS.Transform.toString(transform),
				transition,
				touchAction: "none",
				backgroundColor: "lime",
				margin: 10,
				textAlign: "center"
			}
			}
			{...attributes}
			{...listeners}
		>
			{id}
		</div>
	);
}

export { SortableCandidate };