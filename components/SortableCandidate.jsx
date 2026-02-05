import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableCandidate({ id }) {
	const {
		attributes,
		isDragging,
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
					transform: CSS.Translate.toString(transform),
					transition,
					backgroundColor: "gold",
					marginTop: 10,
					marginBottom: 10,
					marginLeft: "auto",
					marginRight: "auto",
					width: 400,
					maxWidth: "90%",
					padding: 10,
					position: isDragging && "relative",
					zIndex: 1
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