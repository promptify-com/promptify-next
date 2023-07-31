import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { object, string } from 'yup';
import { useFormik } from 'formik';
import { Select, MenuItem, TextField, Input, Chip, Autocomplete, InputLabel, Checkbox, Stack } from '@mui/material';
import {  useGetTagsQuery } from '@/core/api/explorer';
import { Templates } from '@/core/api/dto/templates';
import { IEditTemplate } from '@/common/types/editTemplate';
import { createTemplate, updateTemplate } from '@/hooks/api/templates';
import { authClient } from '@/common/axios';
import {selectStyle, boxStyle, buttonBoxStyle, typographyStyle} from '../../modals/styles'
import { useGetCategoriesQuery } from '@/core/api/categories';

interface Props {
  templateData: Templates | null;
  modalNew?: boolean;
  refetchTemplates?: () => void;
  onSaved?: () => void;
}

const TemplateForm: React.FC<Props> = ({
  templateData,
  modalNew = false,
  refetchTemplates = () => {},
  onSaved = () => {},
}) => {
  
  const { data: categories } = useGetCategoriesQuery();
  const { data: fetchedTags } = useGetTagsQuery();
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    setSelectedTags(templateData?.tags.map(tag => tag.name) || []);
  }, [templateData]);

  useEffect(() => {
    if (fetchedTags) setTags(fetchedTags.map(tag => tag.name));
  }, [fetchedTags]);

  useEffect(() => {
    formik.setFieldValue(
      'tags',
      selectedTags.map(tag => ({ name: tag })),
    );
  }, [selectedTags]);

  const getUrlImage = async (image: File) => {
    const file = new FormData();
    file.append('file', image);
    const { data: { file_url } } = await authClient.post('/api/upload/', file);
    formik.values.thumbnail = file_url;
  };

  const addNewTag = (newValue: string[]) => {
    setSelectedTags(newValue);
  };

  const FormSchema = object({
    title: string().min(1).required('required'),
    description: string().min(1).required('required'),
    thumbnail: string().min(1).required('required'),
  });

  const onEditTemplate = async (values: IEditTemplate) => {
    if (!templateData) return;

    await updateTemplate(templateData?.id, values);
    onSaved();
    refetchTemplates();
    formik.resetForm();
  };

  const onCreateTemplate = async (values: IEditTemplate) => {
    const { id } = await createTemplate(values);
    onSaved();
    refetchTemplates();
    formik.resetForm();
    window.open(window.location.origin + `/builder/${id}`, '_blank');
  };

  const formik =  useFormik<IEditTemplate>({
    initialValues: {
      title: templateData?.title || '',
      description: templateData?.description || '',
      duration: templateData?.duration?.toString() || '1',
      difficulty: templateData?.difficulty || 'BEGINNER',
      is_visible: templateData?.is_visible || true,
      language: templateData?.language || 'en-us',
      category: templateData?.category?.id || 1,
      context: templateData?.context || '',
      tags: templateData?.tags || [],
      thumbnail: templateData?.thumbnail || '',
      executions_limit: templateData?.executions_limit || -1,
      slug: templateData?.slug || '',
      meta_title: templateData?.meta_title || '',
      meta_description: templateData?.meta_description || '',
      meta_keywords: templateData?.meta_keywords || '',
      ...(modalNew && { prompts_list: [] }),
    },
    enableReinitialize: true,
    validationSchema: FormSchema,
    onSubmit: modalNew ? onCreateTemplate : onEditTemplate,
  });

  return (
    <Box>
      <Box style={boxStyle}>
        <Typography style={typographyStyle}>Title</Typography>
        <TextField
          multiline
          maxRows={4}
          sx={selectStyle}
          name="title"
          value={formik.values.title}
          onChange={formik.handleChange}
          error={formik.touched.title && formik.values.title === ''}
        />
      </Box>
      <Box style={boxStyle}>
        <Typography style={typographyStyle}>Description</Typography>
        <TextField
          multiline
          maxRows={4}
          sx={selectStyle}
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          error={formik.touched.description && formik.values.description === ''}
        />
      </Box>
      <Box style={boxStyle}>
        <Typography style={typographyStyle}>Thumbnail</Typography>
        <Box display="flex" flexDirection="column">
          {formik.values.thumbnail && (
            <img src={formik.values.thumbnail} alt="thumbnail" style={{ maxWidth: '250px' }} />
          )}
          <Input
            type="file"
            sx={{ width: '250px' }}
            onChange={(args: any) => {
              getUrlImage(args.target.files[0]);
            }}
          />
        </Box>
      </Box>

      <Box style={boxStyle}>
        <Typography style={typographyStyle}>Difficulty</Typography>
        <Select
          sx={selectStyle}
          name="difficulty"
          value={formik.values.difficulty}
          onChange={formik.handleChange}
        >
          <MenuItem value={'BEGINNER'}>Beginner</MenuItem>
          <MenuItem value={'INTERMEDIATE'}>Intermediate</MenuItem>
          <MenuItem value={'ADVANCED'}>Advanced</MenuItem>
        </Select>
      </Box>
      <Box style={boxStyle}>
        <Typography style={typographyStyle}>Duration</Typography>
        <TextField
          multiline
          maxRows={4}
          sx={selectStyle}
          name="duration"
          value={formik.values.duration}
          onChange={formik.handleChange}
        />
      </Box>
      <Box style={boxStyle}>
        <Typography style={typographyStyle}>Visibility</Typography>
        <Select
          sx={selectStyle}
          name="is_visible"
          value={formik.values.is_visible ? '1' : '0'}
          onChange={formik.handleChange}
        >
          <MenuItem value={1}>Yes</MenuItem>
          <MenuItem value={0}>No</MenuItem>
        </Select>
      </Box>
      <Box style={boxStyle}>
        <Typography style={typographyStyle}>Language</Typography>
        <Select
          sx={selectStyle}
          name="language"
          value={formik.values.language}
          onChange={formik.handleChange}
        >
          <MenuItem value={'en-us'}>English</MenuItem>
          <MenuItem value={'es'}>Spanish</MenuItem>
          <MenuItem value={'fr'}>French</MenuItem>
        </Select>
      </Box>
      {categories && (
        <Box style={boxStyle}>
          <Typography style={typographyStyle}>Category</Typography>
          <Select
            sx={selectStyle}
            name="category"
            value={formik.values.category}
            onChange={formik.handleChange}
          >
            {categories.map(category => (
              <MenuItem value={category.id} key={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </Box>
      )}
      <Box style={boxStyle}>
        <Typography style={typographyStyle}>Template Context</Typography>
        <TextField
          multiline
          maxRows={4}
          sx={selectStyle}
          name="context"
          value={formik.values.context}
          onChange={formik.handleChange}
        />
      </Box>
      <Box style={boxStyle}>
        <Typography style={typographyStyle}>Tags</Typography>
        <Autocomplete
          multiple
          freeSolo
          sx={selectStyle}
          options={tags}
          value={selectedTags}
          onChange={(event, newValue) => addNewTag(newValue)}
          renderTags={(value: readonly string[], getTagProps) =>
            value.map((option: string, index: number) => (
              <Chip
                variant="outlined"
                label={option}
                {...getTagProps({ index })}
                key={option}
              />
            ))
          }
          renderInput={params => <TextField {...params} />}
        />
      </Box>
      <Box style={boxStyle}>
        <Typography style={typographyStyle}>Hourly Limit</Typography>
        <TextField
          maxRows={1}
          sx={selectStyle}
          name="executions_limit"
          value={formik.values.executions_limit}
          onChange={formik.handleChange}
        />
      </Box>
      <Box style={{ ...boxStyle, alignItems: 'baseline' }}>
        <Typography style={typographyStyle}>Slug</Typography>
        <Box>
          <Stack direction={'row'} alignItems={'center'}>
            <Checkbox
              sx={{ color: 'grey.600' }}
              checked={formik.values.slug === null}
              onChange={() => {
                formik.setFieldValue(
                  'slug',
                  formik.values.slug === null ? '' : null
                );
              }}
            />
            <InputLabel sx={{ color: 'grey.600' }}>Use Default</InputLabel>
          </Stack>
          <TextField
            sx={selectStyle}
            name="slug"
            value={formik.values.slug ?? ''}
            disabled={formik.values.slug === null}
            onChange={formik.handleChange}
          />
        </Box>
      </Box>
      <Box style={{ ...boxStyle, alignItems: 'baseline' }}>
        <Typography style={typographyStyle}>Meta title</Typography>
        <Box>
          <Stack direction={'row'} alignItems={'center'}>
            <Checkbox
              sx={{ color: 'grey.600' }}
              checked={formik.values.meta_title === null}
              onChange={() => {
                formik.setFieldValue(
                  'meta_title',
                  formik.values.meta_title === null ? '' : null
                );
              }}
            />
            <InputLabel sx={{ color: 'grey.600' }}>Use Default</InputLabel>
          </Stack>
          <TextField
            sx={selectStyle}
            name="meta_title"
            value={formik.values.meta_title ?? ''}
            disabled={formik.values.meta_title === null}
            onChange={formik.handleChange}
          />
        </Box>
      </Box>
      <Box style={{ ...boxStyle, alignItems: 'baseline' }}>
        <Typography style={typographyStyle}>Meta Description</Typography>
        <Box>
          <Stack direction={'row'} alignItems={'center'}>
            <Checkbox
              sx={{ color: 'grey.600' }}
              checked={formik.values.meta_description === null}
              onChange={() => {
                formik.setFieldValue(
                  'meta_description',
                  formik.values.meta_description === null ? '' : null
                );
              }}
            />
            <InputLabel sx={{ color: 'grey.600' }}>Use Default</InputLabel>
          </Stack>
          <TextField
            multiline
            maxRows={4}
            sx={selectStyle}
            name="meta_description"
            value={formik.values.meta_description ?? ''}
            disabled={formik.values.meta_description === null}
            onChange={formik.handleChange}
          />
        </Box>
      </Box>
      <Box style={{ ...boxStyle, alignItems: 'baseline' }}>
        <Typography style={typographyStyle}>Meta Tags</Typography>
        <Box>
          <Stack direction={'row'} alignItems={'center'}>
            <Checkbox
              sx={{ color: 'grey.600' }}
              checked={formik.values.meta_keywords === null}
              onChange={() => {
                formik.setFieldValue(
                  'meta_keywords',
                  formik.values.meta_keywords === null ? '' : null
                );
              }}
            />
            <InputLabel sx={{ color: 'grey.600' }}>Use Default</InputLabel>
          </Stack>
          <TextField
            sx={selectStyle}
            name="meta_keywords"
            value={formik.values.meta_keywords ?? ''}
            disabled={formik.values.meta_keywords === null}
            onChange={formik.handleChange}
          />
        </Box>
      </Box>
      <Box sx={buttonBoxStyle}>
        <Button
          variant="contained"
          onClick={() => {
            formik.submitForm();
          }}
        >
          Save
        </Button>
        {!modalNew && (
          <Button
            variant="contained"
            sx={{ mt: '20px' }}
            onClick={() => {
              window.open(
                window.location.origin + `/builder/${templateData?.id}`,
                '_blank'
              );
            }}
          >
            Prompt Builder
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default TemplateForm;