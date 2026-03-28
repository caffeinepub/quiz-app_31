import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";

module {
  type OldActor = {
    categories : Map.Map<Text, {
      id : Text;
      name : Text;
    }>;
    questions : Map.Map<Text, {
      id : Text;
      categoryId : Text;
      text : Text;
      options : [Text];
      correctAnswer : Nat;
    }>;
    leaderboard : List.List<{
      name : Text;
      score: Nat;
      total: Nat;
      percentage: Float;
      category: Text;
      timestamp: Time.Time;
    }>;
  };

  type NewActor = {
    categories : Map.Map<Text, {
      id : Text;
      name : Text;
    }>;
    questions : Map.Map<Text, {
      id : Text;
      categoryId : Text;
      text : Text;
      options : [Text];
      correctAnswer : Nat;
    }>;
    posts : Map.Map<Text, {
      id : Text;
      author : Text;
      content : Text;
      likes : Nat;
      timestamp : Time.Time;
      tags : [Text];
    }>;
    leaderboard : List.List<{
      name : Text;
      score: Nat;
      total: Nat;
      percentage: Float;
      category: Text;
      timestamp: Time.Time;
    }>;
  };

  public func run(old : OldActor) : NewActor {
    let emptyPosts = Map.empty<Text, {
      id: Text;
      author: Text;
      content: Text;
      likes: Nat;
      timestamp: Time.Time;
      tags: [Text];
    }>();

    {
      old with
      posts = emptyPosts;
    };
  };
};
