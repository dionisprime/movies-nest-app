import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MovieService } from '../movie/movie.service';
import { PlaylistService } from '../playlist/playlist.service';
import { UserService } from '../user/user.service';
import { Report, ReportDocument } from './report.schema';

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(Report.name) private reportModel: Model<ReportDocument>,
    private movieService: MovieService,
    private playlistService: PlaylistService,
    private userService: UserService,
  ) {}

  async generateReport(): Promise<Report> {
    const totalMovies = await this.movieService.countMovies();
    const totalPlaylists = await this.playlistService.countPlaylists();
    const totalUsers = await this.userService.countUsers();

    const report = new this.reportModel({
      totalMovies,
      totalPlaylists,
      totalUsers,
    });

    return report.save();
  }

  // create(createReportDto: CreateReportDto) {
  //   return 'This action adds a new report';
  // }

  // findAll() {
  //   return `This action returns all report`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} report`;
  // }

  // update(id: number, updateReportDto: UpdateReportDto) {
  //   return `This action updates a #${id} report`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} report`;
  // }
}
