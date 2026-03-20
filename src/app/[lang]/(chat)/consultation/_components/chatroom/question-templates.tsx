import { ChartLine, Lightbulb, PiggyBank } from 'lucide-react';

interface ChatroomQuestionTemplatesProps {
  onTemplateClicked: (templateId: string, displayText?: string) => void;
  onTemplateChoicesClicked?: () => void;
  vocabularies: any;
}

export default function ChatroomQuestionTemplates({
  onTemplateClicked = () => {},
  onTemplateChoicesClicked = () => {},
  vocabularies,
}: ChatroomQuestionTemplatesProps) {
  const {
    chat: {
      templates: { savingBestPractices, howToChooseInstrument, howTheStrategy },
    },
  } = vocabularies;
  return (
    <div className='flex flex-col gap-2'>
      <div
        onClick={() => onTemplateClicked('A22A', savingBestPractices)}
        className='p-4 border-2 rounded-lg flex gap-4 hover:bg-gray-100 cursor-pointer'
      >
        <Lightbulb size={24} className='text-docduit-yellow' />
        <p>{savingBestPractices}</p>
      </div>
      <div
        onClick={() => onTemplateChoicesClicked()}
        className='p-4 border-2 rounded-lg flex gap-4 hover:bg-gray-100 cursor-pointer'
      >
        <ChartLine size={24} className='text-docduit-blue' />
        <p>{howToChooseInstrument}</p>
      </div>
      <div
        onClick={() => onTemplateClicked('A22B', howTheStrategy)}
        className='p-4 border-2 rounded-lg flex gap-4 hover:bg-gray-100 cursor-pointer'
      >
        <PiggyBank size={24} className='text-docduit-red' />
        <p>{howTheStrategy}</p>
      </div>
    </div>
  );
}
