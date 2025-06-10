import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetTestDto } from './dto/get-test.dto';
import { SubmitTestDto } from './dto/submit-test.dto';
import { skill_enum } from '@prisma/client';

@Injectable()
export class IeltsTestsService {
  constructor(private prisma: PrismaService) {}

  // Tạo mới đề thi
  async createTest(data: {
    name: string;
    description?: string;
    reading?: boolean;
    listening?: boolean;
    writing?: boolean;
    speaking?: boolean;
  }) {
    return await this.prisma.ielts_mock_tests.create({
      data: {
        name: data.name,
        description: data.description,
        reading: data.reading || false,
        listening: data.listening || false,
        writing: data.writing || false,
        speaking: data.speaking || false,
      },
    });
  }

  // Tạo mới câu hỏi cho đề thi
  async createQuestion(data: {
    mock_test_id: number;
    skill: string; // reading, listening, writing, speaking
    task_number?: number;
    question_text: string;
    options?: string; // JSON string
    correct_answer?: string;
  }) {
    const test = await this.prisma.ielts_mock_tests.findUnique({
      where: { id: data.mock_test_id },
    });
    if (!test) {
      throw new NotFoundException('Không tìm thấy đề thi');
    }
    return await this.prisma.ielts_mock_test_questions.create({
      data: {
        mock_test_id: data.mock_test_id,
        skill: data.skill as skill_enum,
        question_text: data.question_text,
        options: data.options || null,
        correct_answer: data.correct_answer || null,
      },
    });
  }

  // Lấy đề thi hoặc danh sách đề thi
  async getTests(query: GetTestDto) {
    const { testId, skill } = query;
    if (testId) {
      const test = await this.prisma.ielts_mock_tests.findUnique({
        where: { id: testId },
        include: { questions: true },
      });
      if (!test) {
        throw new NotFoundException('Không tìm thấy đề thi');
      }
      return test;
    }
    let whereCond = {};
    if (skill) {
      // Nếu muốn lọc theo skill, ta có thể tìm các đề mà phần đó được đánh dấu là true
      whereCond = { [skill]: true };
    }
    return await this.prisma.ielts_mock_tests.findMany({
      where: whereCond,
      include: { questions: true },
    });
  }

  // Nộp bài thi và chấm điểm theo từng phần
  async submitTest(body: SubmitTestDto) {
    console.log('Body submit:', body);

    const { testId, answers, highlights, speaking_audio_url } = body;

    // Lấy đề thi và các câu hỏi của đề
    const test = await this.prisma.ielts_mock_tests.findUnique({
      where: { id: testId },
      include: { questions: true },
    });
    if (!test) {
      throw new NotFoundException('Đề thi không tồn tại');
    }

    // Khởi tạo điểm từng phần
    let readingScore = 0;
    let listeningScore = 0;
    let writingScore = 0;
    let speakingScore = 0;

    // Tách các câu hỏi theo kỹ năng
    const readingQuestions = test.questions.filter(
      (q: { skill: string }) => q.skill === 'reading',
    );
    const listeningQuestions = test.questions.filter(
      (q: { skill: string }) => q.skill === 'listening',
    );
    const writingQuestions = test.questions.filter(
      (q: { skill: string }) => q.skill === 'writing',
    );
    const speakingQuestions = test.questions.filter(
      (q: { skill: string }) => q.skill === 'speaking',
    );

    // Hàm so sánh đáp án đơn giản (có thể nâng cấp)
    const checkAnswer = (userAns: string, correctAns: string) => {
      if (!userAns || !correctAns) return false;
      return userAns.trim().toLowerCase() === correctAns.trim().toLowerCase();
    };

    // Chấm điểm Reading
    const readingDetails = readingQuestions.map(
      (q: { id: number; correct_answer?: string | null }) => {
        const userAns = answers[q.id.toString()];
        const isCorrect = q.correct_answer
          ? checkAnswer(userAns, q.correct_answer)
          : false;
        if (isCorrect) readingScore++;
        return { questionId: q.id, userAnswer: userAns, isCorrect };
      },
    );

    // Chấm điểm Listening
    const listeningDetails = listeningQuestions.map(
      (q: { id: number; correct_answer?: string | null }) => {
        const userAns = answers[q.id.toString()];
        const isCorrect = q.correct_answer
          ? checkAnswer(userAns, q.correct_answer)
          : false;
        if (isCorrect) listeningScore++;
        return { questionId: q.id, userAnswer: userAns, isCorrect };
      },
    );

    // Chấm điểm Writing – đối với essay, có thể dùng AI chấm điểm (ở đây làm mẫu đơn giản)
    const writingDetails = writingQuestions.map((q: { id: number }) => {
      const userAns = answers[q.id.toString()];
      // Giả sử nếu người dùng có trả lời thì xét đúng (hoặc gọi API AI)
      const isCorrect = userAns && userAns.trim().length > 0;
      if (isCorrect) writingScore++;
      return { questionId: q.id, userAnswer: userAns, isCorrect };
    });

    // Chấm điểm Speaking – sử dụng AI (ví dụ gọi API của Google) để đánh giá dựa trên file ghi âm
    // Ở ví dụ này, ta giả lập nếu người dùng có URL ghi âm thì tính điểm
    const speakingDetails = speakingQuestions.map((q: { id: number }) => {
      // Giả lập: Nếu có file URL và trả lời, tính đúng đơn giản (thực tế cần gọi AI)
      // const userAns = answers[q.id.toString()];
      const isCorrect = speaking_audio_url ? true : false;
      if (isCorrect) speakingScore++;
      return { questionId: q.id, userAnswer: speaking_audio_url, isCorrect };
    });

    // Tính điểm tổng
    const totalScore =
      readingScore + listeningScore + writingScore + speakingScore;

    // Tạo đối tượng chi tiết đáp án (theo từng phần)
    const answerDetail = {
      reading: {
        score: readingScore,
        total: readingQuestions.length,
        details: readingDetails,
        highlights,
      },
      listening: {
        score: listeningScore,
        total: listeningQuestions.length,
        details: listeningDetails,
      },
      writing: {
        score: writingScore,
        total: writingQuestions.length,
        details: writingDetails,
      },
      speaking: {
        score: speakingScore,
        total: speakingQuestions.length,
        details: speakingDetails,
        speaking_audio_url,
      },
    };

    // Lưu kết quả thi vào bảng ielts_mock_results
    const resultRecord = await this.prisma.ielts_mock_results.create({
      data: {
        user_id: null, // Thay thế bằng user hoặc registration ID thực khi có authentication
        mock_test_id: testId,
        reading_score: readingScore,
        listening_score: listeningScore,
        writing_score: writingScore,
        speaking_score: speakingScore,
        answer_detail: JSON.stringify(answerDetail),
        // Nếu có lưu file cho Listening (vd: file MP3 đã có) hoặc Speaking, lưu URL
        listening_audio_url: null, // Nếu cần
        speaking_audio_url: speaking_audio_url || null,
      },
    });

    return {
      score: totalScore,
      details: answerDetail,
      resultId: resultRecord.id,
    };
  }
}
