import { create } from 'zustand';

interface ProjectStore {
    selectedProjectId: string | null;
    setSelectedProjectId: (id: string | null) => void;
}

const useProjectStore = create<ProjectStore>((set) => ({
    selectedProjectId: null,
    setSelectedProjectId: (id) => set({ selectedProjectId: id }),
}));

export default useProjectStore;