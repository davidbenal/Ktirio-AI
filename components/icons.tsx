import React from 'react';

// A generic icon wrapper
const Icon: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    {children}
  </svg>
);

export const KtirioLogo: React.FC<{ className?: string }> = ({ className = "text-xl font-black tracking-wide" }) => (
    <span className={className}>KTIRIO</span>
);

export const KIcon: React.FC<{ className?: string }> = ({ className = "text-2xl font-black" }) => (
    <span className={className}>K</span>
);

export const SearchIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
    <Icon className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></Icon>
);

export const GalleryIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
    <Icon className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></Icon>
);

export const FolderPlusIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
    <Icon className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></Icon>
);


export const CameraIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <Icon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </Icon>
);

export const SparklesIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <Icon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 16l-4 4-4-4 5.293-5.293a1 1 0 011.414 0L10 12.586l2.293-2.293a1 1 0 011.414 0L17 13.586" />
  </Icon>
);

export const PencilIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <Icon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
  </Icon>
);

export const ShareIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <Icon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </Icon>
);

export const PlusIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <Icon className={className}>
     <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </Icon>
);

export const MinusIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <Icon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
  </Icon>
);

export const PaintBrushIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <Icon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </Icon>
);

export const SelectToolIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.75A2.25 2.25 0 004.5 6v2.25M9 3.75V1.5M9 3.75v2.25m0-2.25h2.25m-2.25 0h-2.25m2.25 0v2.25m0-2.25h2.25M15 3.75H17.25A2.25 2.25 0 0119.5 6v2.25M15 3.75V1.5M15 3.75v2.25m0-2.25h2.25m-2.25 0h-2.25m2.25 0v2.25m0-2.25h2.25M9 15v2.25A2.25 2.25 0 0011.25 19.5h2.25m-2.25 0h2.25m-2.25 0v2.25m0-2.25v-2.25m0 2.25h2.25m-2.25 0h-2.25m2.25 0v-2.25m0 2.25H9m2.25-2.25h2.25" />
    </svg>
);

export const EraserIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.52.232 1.067.378 1.624.378h.381c.414 0 .79-.143 1.11-.377L13.25 10.5l-2.496 3.03c-.52-.232-1.067-.378-1.624-.378h-.381a2.652 2.652 0 00-1.11.377L11.42 15.17zM12 2.25a.75.75 0 000 1.5h.381a1.125 1.125 0 011.11.377l2.496 3.031L19.5 4.5l-2.496-3.031A1.125 1.125 0 0015.894 1.5H12zM3 15.75a.75.75 0 01.75-.75h.381a1.125 1.125 0 001.11-.377L10.5 9.75l-2.496 3.031A1.125 1.125 0 016.894 13.5H3.75a.75.75 0 01-.75-.75z" />
    </svg>
);

export const DownloadIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </Icon>
);

export const HistoryIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.99 2.001A10 10 0 112 12h3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3.5 2" />
    </Icon>
);

export const ChevronLeftIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
    <Icon className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></Icon>
);

export const ChevronRightIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
    <Icon className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></Icon>
);

export const GridMenuIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 8.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6A2.25 2.25 0 0115.75 3.75h2.25A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25A2.25 2.25 0 0113.5 8.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25h2.25a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
);

export const ChevronDownIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
    <Icon className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></Icon>
);

export const StarIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
    <Icon className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></Icon>
);

export const FolderIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
    <Icon className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.75h16.5m-16.5 0a2.25 2.25 0 01-2.25-2.25V6.75c0-1.24 1.009-2.25 2.25-2.25h3.75a.75.75 0 01.6.3l.9 1.2c.3.4.8.6 1.3.6h3.8c1.24 0 2.25 1.01 2.25 2.25v1.5a2.25 2.25 0 01-2.25 2.25m-16.5 0v6.75c0 1.24 1.009 2.25 2.25 2.25h12c1.24 0 2.25-1.01 2.25-2.25v-6.75" /></Icon>
);

export const DuplicateIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
    <Icon className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375V17.25" /></Icon>
);

export const NewFileIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
    <Icon className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></Icon>
);

export const EllipsisVerticalIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
    </Icon>
);

export const ArchiveIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
    <Icon className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4" /></Icon>
);

export const BackArrowIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
    </Icon>
);

export const SpinnerIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
    <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);