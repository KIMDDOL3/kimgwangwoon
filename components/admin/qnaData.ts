
// FIX: Corrected import path
import { QnaItem } from '../../types';

export const MOCK_QNA_DATA: QnaItem[] = [
    {
        id: 'qna-1',
        question: '국가장학금 2차 신청은 언제부터 가능한가요? 1차 신청을 놓쳤습니다.',
        studentName: '김민준',
        studentId: '2022123456',
        date: '2025-08-28',
        status: 'Unanswered',
    },
    {
        id: 'qna-2',
        question: '성적우수 장학금은 별도로 신청하지 않아도 자동으로 지급되는 것이 맞나요?',
        studentName: '이서연',
        studentId: '2021111111',
        date: '2025-08-27',
        status: 'Answered',
        answer: '네, 맞습니다. 성적우수 장학금은 직전 학기 성적을 기준으로 별도의 신청 절차 없이 자동 선발하여 지급하고 있습니다. 자세한 선발 기준은 학교 홈페이지 공지사항을 참고해주시기 바랍니다.'
    },
    {
        id: 'qna-3',
        question: 'IT 인재육성 장학금을 신청하려고 하는데, 포트폴리오는 어떤 형식으로 제출해야 하나요? PDF로 제출해도 되나요?',
        studentName: '박도윤',
        studentId: '2020222222',
        date: '2025-08-26',
        status: 'Unanswered',
    },
    {
        id: 'qna-4',
        question: '생활지원 장학금과 국가장학금(I유형)은 중복으로 수혜가 가능한가요?',
        studentName: '최지아',
        studentId: '2023333333',
        date: '2025-08-25',
        status: 'Answered',
        answer: '네, 두 장학금은 중복 수혜가 가능합니다. 단, 두 장학금의 합계 금액이 해당 학기 등록금 총액을 초과할 수는 없습니다. 초과하는 금액은 반환되거나 감액될 수 있습니다.'
    }
];