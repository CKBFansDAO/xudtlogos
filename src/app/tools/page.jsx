import ToolsClient from '@/components/ToolsClient';

export const metadata = {
  title: 'Tools',
  description: 'Check whether an xUDT or DOB logo exists, generate canonical file names, and prepare a logo pull request.',
};

export default function ToolsPage() {
  return <ToolsClient />;
}
