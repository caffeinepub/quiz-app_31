import Text "mo:core/Text";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";

import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";


actor {
  include MixinStorage();

  let users = Map.empty<Text, List.List<Nat>>();
  let entries = Map.empty<Nat, Text>();
  let likes = Map.empty<Nat, List.List<Text>>();
  let images = Map.empty<Nat, Storage.ExternalBlob>();
  let videos = Map.empty<Nat, Storage.ExternalBlob>();

  var nextId = 0;

  public func createUser(id : Text) : async Bool {
    if (users.containsKey(id)) { Runtime.trap("User already exists") };
    users.add(id, List.empty<Nat>());
    true;
  };

  public func getUser(id : Text) : async [Nat] {
    switch (users.get(id)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?collection) { collection.toArray() };
    };
  };

  public func getAllUsers() : async [Text] {
    users.keys().toArray();
  };

  type Entry = {
    id : Nat;
    data : Text;
    likes : Nat;
    timestamp : Time.Time;
    isPublic : Bool;
  };

  public func getEntry(entryId : Nat) : async Entry {
    switch (entries.get(entryId)) {
      case (null) { Runtime.trap("Entry not found") };
      case (?entry) {
        let likeCount = switch (likes.get(entryId)) {
          case (null) { 0 };
          case (?likes) { likes.size() };
        };
        {
          id = entryId;
          data = entry;
          likes = likeCount;
          timestamp = Time.now();
          isPublic = true;
        };
      };
    };
  };

  public func getAllEntries() : async [Entry] {
    entries.toArray().map(func((id, data)) { { id; data; likes = 0; timestamp = Time.now(); isPublic = true } });
  };

  public func getUserEntries(id : Text) : async [Entry] {
    switch (users.get(id)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?collection) {
        collection.toArray().map(
          func(entryId) {
            switch (entries.get(entryId)) {
              case (null) { Runtime.trap("Entry not found") };
              case (?data) {
                let likeCount = switch (likes.get(entryId)) {
                  case (null) { 0 };
                  case (?likes) { likes.size() };
                };
                { id = entryId; data; likes = likeCount; timestamp = Time.now(); isPublic = true };
              };
            };
          }
        );
      };
    };
  };

  public func createEntry(id : Text, data : Text) : async Entry {
    if (not users.containsKey(id)) { Runtime.trap("User does not exist") };
    let entryId = nextId;
    nextId += 1;

    let userEntries = switch (users.get(id)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?c) { c };
    };
    userEntries.add(entryId);

    entries.add(entryId, data);
    users.add(id, userEntries);

    {
      id = entryId;
      data;
      likes = 0;
      timestamp = Time.now();
      isPublic = true;
    };
  };

  public func updateEntry(entryId : Nat, data : Text) : async () {
    switch (entries.get(entryId)) {
      case (null) { Runtime.trap("Entry does not exist") };
      case (_) { entries.add(entryId, data) };
    };
  };

  public func deleteEntry(entryId : Nat) : async () {
    if (not entries.containsKey(entryId)) { Runtime.trap("Entry does not exist") };
    entries.remove(entryId);
    likes.remove(entryId);
  };

  public func likeEntry(id : Text, entryId : Nat) : async () {
    switch (entries.get(entryId)) {
      case (null) { Runtime.trap("Entry does not exist") };
      case (_) {};
    };

    switch (likes.get(entryId)) {
      case (null) {
        let newLikes = List.empty<Text>();
        newLikes.add(id);
        likes.add(entryId, newLikes);
      };
      case (?likeList) {
        if (likeList.contains(id)) { Runtime.trap("This user already liked the entry!") };
        likeList.add(id);
      };
    };
  };

  public func addToCollection(id : Text, entryId : Nat) : async () {
    if (not users.containsKey(id)) { Runtime.trap("User does not exist") };
    if (not entries.containsKey(entryId)) { Runtime.trap("Entry does not exist") };
    switch (users.get(id)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?c) {
        if (c.contains(entryId)) { Runtime.trap("Entry already in your collection!") };
        c.add(entryId);
      };
    };
  };

  public func removeFromCollection(id : Text, entryId : Nat) : async () {
    switch (users.get(id)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?c) {
        if (not c.contains(entryId)) { Runtime.trap("Entry not in your collection") };
        users.add(id, c.filter(func(x) { x != entryId }));
      };
    };
  };

  public query ({ caller }) func isPublic(entryId : Nat) : async Bool {
    switch (entries.get(entryId)) {
      case (null) { Runtime.trap("Entry does not exist") };
      case (_) { true };
    };
  };

  public func saveImage(userId : Text, name : Text, blob : Storage.ExternalBlob) : async () {
    images.add(images.size() + videos.size(), blob);
  };

  public func saveVideo(userId : Text, name : Text, blob : Storage.ExternalBlob) : async () {
    videos.add(images.size() + videos.size(), blob);
  };
};
