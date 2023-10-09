import { IEditPrompts, InputVariable } from "../types/builder";
import { getInputsFromString } from "./getInputsFromString";

export const getBuilderVarsPresets = (nodes: IEditPrompts[], selectedNode: IEditPrompts, filter = true) => {
  const otherNodes = !filter
    ? nodes
    : nodes.filter(
        node =>
          (node.id !== selectedNode.id && node.id !== selectedNode.temp_id) ||
          (node.temp_id !== selectedNode.id && node.temp_id !== selectedNode.temp_id),
      );
  const outputPresets = otherNodes.map(node => ({ id: node.id, label: node.prompt_output_variable || node.title }));
  const inputPresets = otherNodes
    .map(node => ({ id: node.id, inputs: getInputsFromString(node.content) }))
    .filter(node => node.inputs && node.inputs.length)
    .flatMap(node =>
      node.inputs.map(input => ({
        id: node.id,
        label: input.name,
        type: input.type,
        required: input.required,
        choices: input.choices,
      })),
    );

  const uniqueInputPresets = new Map<string, InputVariable>();
  inputPresets.forEach(input => {
    if (!uniqueInputPresets.has(input.label)) {
      uniqueInputPresets.set(input.label, input);
    }
  });
  const filteredInputPresets: InputVariable[] = Array.from(uniqueInputPresets.values());

  return {
    outputPresets,
    inputPresets: filteredInputPresets,
  };
};
