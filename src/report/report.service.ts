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
}
