// Example prompts payload
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const payload = {
  title: 'Template',
  description: 'Template description',
  example: 'Template example',
  thumbnail: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
  is_visible: true,
  language: 'en-US',
  category_id: 1,
  prompts: [
    {
      temp_id: 1,
      content: 'First prompt {{variable}}',
      title: 'Prompt 1',
      engine: 1,
      parameters: [
        {
          id: 1,
          score: 3,
        },
      ],
    },
    {
      temp_id: 2,
      content: 'Second prompt {{variable}}',
      title: 'Prompt 2',
      engine: 1,
    },
    {
      temp_id: 3,
      content: 'Third prompt {{variable}}',
      title: 'Prompt 3',
      engine: 1,
      dependencies: [1, 2],
    },
    {
      temp_id: 4,
      content: 'Fourth prompt {{variable}}',
      title: 'Prompt 4',
      engine: 1,
      dependencies: [3],
    },
    {
      temp_id: 5,
      content: 'Fifth prompt {{variable}}',
      title: 'Prompt 5',
      engine: 1,
      dependencies: [3],
    },
  ],
};
