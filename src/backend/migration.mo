import List "mo:core/List";
import Map "mo:core/Map";
import Text "mo:core/Text";

module {
  type Category = {
    id : Text;
    name : Text;
  };

  type Question = {
    id : Text;
    categoryId : Text;
    text : Text;
    options : [Text];
    correctAnswer : Nat;
  };

  type LeaderboardEntry = {
    name : Text;
    score : Nat;
    total : Nat;
    percentage : Float;
    category : Text;
    timestamp : Int;
  };

  type OldActor = {
    categories : Map.Map<Text, Category>;
    questions : Map.Map<Text, Question>;
  };

  type NewActor = {
    categories : Map.Map<Text, Category>;
    questions : Map.Map<Text, Question>;
    leaderboard : List.List<LeaderboardEntry>;
  };

  public func run(oldActor : OldActor) : NewActor {
    {
      oldActor with
      leaderboard = List.empty<LeaderboardEntry>();
    };
  };
};
