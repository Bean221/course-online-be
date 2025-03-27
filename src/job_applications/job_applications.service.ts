import { Injectable } from '@nestjs/common';
import { CreateJobApplicationDto } from './dto/create-job_application.dto';
import { UpdateJobApplicationDto } from './dto/update-job_application.dto';

@Injectable()
export class JobApplicationsService {
  create(createJobApplicationDto: CreateJobApplicationDto) {
    return 'This action adds a new jobApplication';
  }

  findAll() {
    return `This action returns all jobApplications`;
  }

  findOne(id: number) {
    return `This action returns a #${id} jobApplication`;
  }

  update(id: number, updateJobApplicationDto: UpdateJobApplicationDto) {
    return `This action updates a #${id} jobApplication`;
  }

  remove(id: number) {
    return `This action removes a #${id} jobApplication`;
  }
}
