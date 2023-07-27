import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { object, string } from 'yup';
import { useFormik } from 'formik';
import { Select, MenuItem, TextField, Input, Chip, Autocomplete, InputLabel, Checkbox, Stack } from '@mui/material';

import {  useGetTagsQuery } from '@/core/api/explorer';
import { Templates } from '@/core/api/dto/templates';
import { IEditTemplate } from '@/common/types/editTemplate';
import { createTemplate, updateTemplate } from '@/hooks/api/templates';
import { authClient } from '@/common/axios';
import {style, selectStyle, boxStyle, buttonBoxStyle, typographyStyle} from './styles'
import { useGetCategoriesQuery } from '@/core/api/categories';

interface IModal {
  open: boolean;
  setOpen: (val: boolean) => void;
  data: Templates[];
  modalNew: boolean;
  refetchTemplates: () => void;
}

export default function TemplateFormModal({ open, setOpen, data, modalNew, refetchTemplates }: IModal) {
  const { data: categories } = useGetCategoriesQuery();
  const { data: fetchedTags } = useGetTagsQuery();
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setSelectedTags(data[0]?.tags.map(tag => tag.name) || []);
  }, [data]);

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
    await updateTemplate(data[0]?.id, values);
    handleClose();
    refetchTemplates();
    formik.resetForm();
  };

  const onCreateTemplate = async (values: IEditTemplate) => {
    const { id } = await createTemplate(values);
    handleClose();
    refetchTemplates();
    formik.resetForm();
    window.open(window.location.origin + `/builder/${id}`, '_blank');
  };

  const formik =  useFormik<IEditTemplate>({
    initialValues: {
      title: data[0]?.title || '',
      description: data[0]?.description || '',
      duration: data[0]?.duration?.toString() || '1',
      difficulty: data[0]?.difficulty || 'BEGINNER',
      is_visible: data[0]?.is_visible || true,
      language: data[0]?.language || 'en-us',
      category: data[0]?.category?.id || 1,
      context: data[0]?.context || '',
      tags: data[0]?.tags || [],
      thumbnail: data[0]?.thumbnail,
      executions_limit: data[0]?.executions_limit || -1,
      slug: data[0]?.slug || '',
      meta_title: data[0]?.meta_title || '',
      meta_description: data[0]?.meta_description || '',
      meta_keywords: data[0]?.meta_keywords || '',
      ...(modalNew && { prompts_list: [] }),
    },
    enableReinitialize: true,
    validationSchema: FormSchema,
    onSubmit: modalNew ? onCreateTemplate : onEditTemplate,
  });

  return (
    <div>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
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
          <Box style={buttonBoxStyle} flexDirection="column">
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
                    window.location.origin + `/builder/${data[0]?.id}`,
                    '_blank'
                  );
                }}
              >
                Prompt Builder
              </Button>
            )}
          </Box>
        </Box>
      </Modal>
    </div>
  );
}


