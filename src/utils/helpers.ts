import { format, isToday, isTomorrow, isYesterday, parseISO } from 'date-fns';

export const formatDate = (dateString: string): string => {
  const date = parseISO(dateString);
  if (isToday(date)) {
    return `Today, ${format(date, 'h:mm a')}`;
  } else if (isTomorrow(date)) {
    return `Tomorrow, ${format(date, 'h:mm a')}`;
  } else if (isYesterday(date)) {
    return `Yesterday, ${format(date, 'h:mm a')}`;
  }
  return format(date, 'MMM d, yyyy');
};

export const priorityColor = (priority: string): string => {
  switch (priority) {
    case 'Cao':
      return 'bg-red-500';
    case 'Trung bình':
      return 'bg-amber-500';
    case 'Thấp':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

export const statusColor = (status: string): string => {
  switch (status) {
    case 'Chuẩn bị làm':
      return 'bg-gray-500';
    case 'Đang làm':
      return 'bg-blue-500';
    case 'Hoàn thành':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};