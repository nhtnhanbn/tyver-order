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
					touchAction: "none",
					backgroundColor: "lime",
					marginTop: 10,
					marginBottom: 10,
					marginLeft: "auto",
					marginRight: "auto",
					width: 100,
					textAlign: "center",
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