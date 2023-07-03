import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Select, MenuItem, TextField, Input, Chip, Autocomplete, InputLabel, Checkbox, Stack } from '@mui/material';
import { useGetCategoriesQuery, useGetTagsQuery } from '../../core/api/explorer';
import { Templates } from '../../core/api/dto/templates';
import { useFormik } from 'formik';
import { IEditTemplate } from '../../common/types/editTemplate';
import { object, string } from 'yup';
import { createTemplate, updateTemplate } from '../../hooks/api/templates';
import { authClient } from '../../common/axios';

interface IModal {
  open: boolean;
  setOpen: (val: boolean) => void;
  data: Templates[];
  modalNew: boolean;
  reloadData: () => void;
}

export default function TemplateModal({ open, setOpen, data, modalNew, reloadData }: IModal) {
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

  // Keep updating formik tags field based on selected tags names from selectedTags
  useEffect(() => {
    formik.setFieldValue(
      'tags',
      selectedTags.map(tag => ({ name: tag })),
    );
  }, [selectedTags]);

  const getUrlImage = async (image: File) => {
    const file = new FormData();
    file.append('file', image);
    await authClient.post('/api/upload/', file).then(data => {
      formik.values.thumbnail = data.data.file_url;
    });
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
    updateTemplate(data[0]?.id, values).then(() => {
      handleClose();
      reloadData();
      formik.resetForm();
    });
  };

  const onCreateTemplate = async (values: IEditTemplate) => {
    createTemplate(values).then(data => {
      handleClose();
      reloadData();
      formik.resetForm();
      window.open(window.location.origin + `/builder/${data.id}`, '_blank');
    });
  };

  const formik = useFormik<IEditTemplate>({
    initialValues: {
      title: data[0]?.title || '',
      description: data[0]?.description || '',
      duration: data[0]?.duration.toString() || '1',
      difficulty: data[0]?.difficulty || 'BEGINNER',
      is_visible: data[0]?.is_visible || true,
      language: data[0]?.language || 'en-us',
      category: data[0]?.category.id || 1,
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
                {categories.map(category => {
                  return (
                    <MenuItem value={category.id} key={category.id}>
                      {category.name}
                    </MenuItem>
                  );
                })}
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
          <Box style={{...boxStyle, alignItems: 'baseline'}}>
            <Typography style={typographyStyle}>Slug</Typography>
            <Box>
              <Stack direction={'row'} alignItems={'center'} >
                <Checkbox
                  sx={{ color: 'grey.600' }}
                  checked={formik.values.slug === null}
                  onChange={() => {
                    formik.setFieldValue('slug', formik.values.slug === null ? '' : null)
                  }}
                />
                <InputLabel sx={{ color: 'grey.600' }}>Use Default</InputLabel>
              </Stack>
              <TextField sx={selectStyle}
                name="slug"
                value={formik.values.slug === null ? '' : formik.values.slug}
                disabled={formik.values.slug === null}
                onChange={formik.handleChange}
              />
            </Box>
          </Box>
          <Box style={{...boxStyle, alignItems: 'baseline'}}>
            <Typography style={typographyStyle}>Meta title</Typography>
            <Box>
              <Stack direction={'row'} alignItems={'center'} >
                <Checkbox
                  sx={{ color: 'grey.600' }}
                  checked={formik.values.meta_title === null}
                  onChange={() => {
                    formik.setFieldValue('meta_title', formik.values.meta_title === null ? '' : null)
                  }}
                />
                <InputLabel sx={{ color: 'grey.600' }}>Use Default</InputLabel>
              </Stack>
              <TextField sx={selectStyle}
                name="meta_title"
                value={formik.values.meta_title === null ? '' : formik.values.meta_title}
                disabled={formik.values.meta_title === null}
                onChange={formik.handleChange}
              />
            </Box>
          </Box>
          <Box style={{...boxStyle, alignItems: 'baseline'}}>
            <Typography style={typographyStyle}>Meta Description</Typography>
            <Box>
              <Stack direction={'row'} alignItems={'center'} >
                <Checkbox
                  sx={{ color: 'grey.600' }}
                  checked={formik.values.meta_description === null}
                  onChange={() => {
                    formik.setFieldValue('meta_description', formik.values.meta_description === null ? '' : null)
                  }}
                />
                <InputLabel sx={{ color: 'grey.600' }}>Use Default</InputLabel>
              </Stack>
              <TextField
                multiline
                maxRows={4}
                sx={selectStyle}
                name="meta_description"
                value={formik.values.meta_description === null ? '' : formik.values.meta_description}
                disabled={formik.values.meta_description === null}
                onChange={formik.handleChange}
              />
            </Box>
          </Box>
          <Box style={{...boxStyle, alignItems: 'baseline'}}>
            <Typography style={typographyStyle}>Meta Tags</Typography>
            <Box>
              <Stack direction={'row'} alignItems={'center'} >
                <Checkbox
                  sx={{ color: 'grey.600' }}
                  checked={formik.values.meta_keywords === null}
                  onChange={() => {
                    formik.setFieldValue('meta_keywords', formik.values.meta_keywords === null ? '' : null)
                  }}
                />
                <InputLabel sx={{ color: 'grey.600' }}>Use Default</InputLabel>
              </Stack>
              <TextField sx={selectStyle}
                name="meta_keywords"
                value={formik.values.meta_keywords === null ? '' : formik.values.meta_keywords}
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
                  window.open(window.location.origin + `/builder/${data[0]?.id}`, '_blank');
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

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxHeight: '70vh',
  width: '600px',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'scroll',
  overscrollBehavior: 'contain',
};

const selectStyle = {
  width: '250px',
  ".Mui-disabled .MuiOutlinedInput-notchedOutline": {
    border: "none",
    bgcolor: "grey.100",
  }
};

const boxStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '100px',
  marginTop: '25px',
};

const buttonBoxStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignSelf: 'center',
  width: '250px',
  marginTop: '50px',
};

const typographyStyle = {
  fontSize: '20px',
  fontWeight: '400',
};
