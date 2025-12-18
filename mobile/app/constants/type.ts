export type Team = {
  id: number;
  name: string;
  crest: string;
  tla: string;
};

export type Competition = {
  id: number;
  name: string;
  emblem: string;
};

export type Match = {
  id: number;
  utcDate: string;
  homeTeam: Team;
  awayTeam: Team;
  competition: Competition;
};
