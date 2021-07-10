export class ScrapModel {
  colorCode?: string;
  xDirection?: number;
  yDirection?: number;
  content?: string;
  date?: Date;

  constructor(
    colorCode?: string,
    xDirection?: number,
    yDirection?: number,
    content?: string,
    date?: Date,
  ) {
    this.colorCode = colorCode;
    this.xDirection = xDirection;
    this.yDirection = yDirection;
    this.content = content;
    this.date = date;
  }
}
