const ProgressStep = ({ active, completed, first, last }) => (
    <div className="flex items-center">
        <div className={`w-3 h-3 rounded-full ${active ? 'bg-blue-900' :
                completed ? 'bg-blue-900' : 'bg-gray-300'
            }`} />
        {!last && (
            <div className={`w-20 h-0.5 ${completed ? 'bg-blue-900' : 'bg-gray-300'
                }`} />
        )}
    </div>
);

export default ProgressStep;