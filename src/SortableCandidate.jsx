import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableCandidate({ id, collapsed }) {
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
					transform: CSS.Translate.toString(transform),
					transition,
					touchAction: "none",
					backgroundColor: "lime",
					marginTop: 10,
					marginBottom: 10,
					marginLeft: "auto",
					marginRight: "auto",
					width: 150,
					textAlign: "center",
					display: collapsed && "none"
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