import { useCreateTemplateMutation } from "@/core/api/templates";
import { isValidUserFn } from "@/core/store/userSlice";
import { getBaseUrl, redirectToPath } from "@/common/helpers";
import { IEditPrompts } from "@/common/types/builder";
import { Templates } from "@/core/api/dto/templates";
import { useAppSelector } from "@/hooks/useStore";
import { useRef } from "react";
import { useRouter } from "next/router";

interface Props {
  template: Templates;
}

const useCloneTemplate = ({ template }: Props) => {
  const router = useRouter();
  const isValidUser = useAppSelector(isValidUserFn);

  const [createTemplate] = useCreateTemplateMutation();

  const isCloning = useRef(false);

  const cloneTemplate = async () => {
    if (!isValidUser) {
      return router.push("/signin");
    }

    if (!isCloning.current) {
      isCloning.current = true;

      try {
        const clonedPrompts: IEditPrompts[] = template.prompts.map(prompt => {
          const params = prompt.parameters.map(param => ({
            parameter_id: param.parameter.id,
            score: param.score,
            is_visible: param.is_visible,
            is_editable: param.is_editable,
          }));

          return {
            temp_id: prompt.id,
            title: prompt.title,
            content: prompt.content,
            engine: prompt.engine.id,
            model_parameters: prompt.model_parameters,
            dependencies: prompt.dependencies || [],
            is_visible: prompt.is_visible,
            show_output: prompt.show_output,
            prompt_output_variable: prompt.prompt_output_variable,
            order: prompt.order,
            parameters: params || [],
            output_format: prompt.output_format,
          };
        });

        const { slug } = await createTemplate({
          title: `${template.title} - Copy`,
          description: template.description,
          duration: template.duration.toString(),
          difficulty: template.difficulty,
          is_visible: template.is_visible,
          language: template.language,
          category: template.category?.id,
          context: template.context,
          tags: template.tags,
          thumbnail: template.thumbnail,
          executions_limit: template.executions_limit,
          meta_title: template.meta_title,
          meta_description: template.meta_description,
          meta_keywords: template.meta_keywords,
          status: "DRAFT",
          prompts_list: clonedPrompts,
        }).unwrap();

        window.open(`${getBaseUrl}/prompt-builder/${slug}?editor=1`, "_blank");
        redirectToPath(`/prompt/${slug}`);
      } catch (err) {
        console.error(err);
      } finally {
        isCloning.current = false;
      }
    }
  };

  return { cloneTemplate };
};

export default useCloneTemplate;
