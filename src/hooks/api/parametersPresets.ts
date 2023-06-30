import { authClient } from '../../common/axios';
import { IParametersPreset, IParametersPresetPost } from '../../common/types/parametersPreset';
import { useEffect, useState } from 'react';

export const useParametersPresets = (): [IParametersPreset[], (presets: IParametersPreset[]) => void] => {
  const [presets, setPresets] = useState<IParametersPreset[]>([]);
  
  useEffect(() => {
    const fetchPresets = async (): Promise<void> => {
      const res = await authClient.get<IParametersPreset[]>('api/meta/presets/');
      setPresets(res.data);
    };

    fetchPresets();
  }, [])

  return [presets, setPresets];

};

export const useUpdateParametersPresets = async (newPreset: IParametersPresetPost) => {
  return await authClient
    .post(`/api/meta/presets/`, { ...newPreset }, { headers: { 'Content-Type': 'application/json' } })
    .then(response => {
      return response.data;
    });
}
