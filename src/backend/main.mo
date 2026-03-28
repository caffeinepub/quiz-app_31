import Text "mo:core/Text";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Time "mo:core/Time";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Float "mo:core/Float";
import Int "mo:core/Int";
import Migration "migration";

(with migration = Migration.run)
actor {
  type Category = {
    id : Text;
    name : Text;
  };

  module Category {
    public func compare(category1 : Category, category2 : Category) : Order.Order {
      Text.compare(category1.id, category2.id);
    };
  };

  type Question = {
    id : Text;
    categoryId : Text;
    text : Text;
    options : [Text];
    correctAnswer : Nat;
  };

  module Question {
    public func compare(question1 : Question, question2 : Question) : Order.Order {
      Text.compare(question1.id, question2.id);
    };
  };

  type LeaderboardEntry = {
    name : Text;
    score : Nat;
    total : Nat;
    percentage : Float;
    category : Text;
    timestamp : Time.Time;
  };

  module LeaderboardEntry {
    public func compare(a : LeaderboardEntry, b : LeaderboardEntry) : Order.Order {
      if (a.percentage > b.percentage) { #less } else if (a.percentage < b.percentage) { #greater } else {
        Int.compare(b.timestamp, a.timestamp);
      };
    };
  };

  type Post = {
    id : Text;
    author : Text;
    content : Text;
    likes : Nat;
    timestamp : Time.Time;
    tags : [Text];
  };

  module Post {
    public func compare(a : Post, b : Post) : Order.Order {
      Int.compare(b.timestamp, a.timestamp);
    };
  };

  type StockSignal = {
    ticker : Text;
    name : Text;
    signal : Text;
    entry : Float;
    target : Float;
    stoploss : Float;
    strength : Nat;
    reason : Text;
    timeframe : Text;
    updatedAt : Time.Time;
  };

  let categories = Map.empty<Text, Category>();
  let questions = Map.empty<Text, Question>();
  let posts = Map.empty<Text, Post>();
  let leaderboard = List.empty<LeaderboardEntry>();

  public shared ({ caller }) func initialize() : async () {
    await forceReinitialize();
  };

  public shared ({ caller }) func forceReinitialize() : async () {
    categories.clear();
    questions.clear();
    leaderboard.clear();

    let initialCategories = [
      { id = "general"; name = "सामान्य ज्ञान" },
      { id = "science"; name = "विज्ञान" },
      { id = "math"; name = "गणित" },
      { id = "computer"; name = "कंप्यूटर" },
      { id = "fun"; name = "मनोरंजन" },
    ];

    for (category in initialCategories.values()) {
      categories.add(category.id, category);
    };

    let allQuestions = [
      // General Knowledge (1-20)
      { id = "gen_q01"; categoryId = "general"; text = "भारत की राजधानी क्या है?"; options = ["Mumbai", "Delhi", "Kolkata", "Chennai"]; correctAnswer = 1 },
      { id = "gen_q02"; categoryId = "general"; text = "भारत के प्रधानमंत्री (2025)?"; options = ["Rahul Gandhi", "Narendra Modi", "Amit Shah", "Manmohan Singh"]; correctAnswer = 1 },
      { id = "gen_q03"; categoryId = "general"; text = "ताजमहल कहाँ है?"; options = ["Delhi", "Agra", "Jaipur", "Mumbai"]; correctAnswer = 1 },
      { id = "gen_q04"; categoryId = "general"; text = "दुनिया का सबसे बड़ा महासागर?"; options = ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"]; correctAnswer = 2 },
      { id = "gen_q05"; categoryId = "general"; text = "सूर्य किस दिशा में उगता है?"; options = ["West", "North", "East", "South"]; correctAnswer = 2 },
      { id = "gen_q06"; categoryId = "general"; text = "भारत का राष्ट्रीय पशु?"; options = ["Lion", "Tiger", "Elephant", "Leopard"]; correctAnswer = 1 },
      { id = "gen_q07"; categoryId = "general"; text = "भारत का राष्ट्रीय पक्षी?"; options = ["Parrot", "Peacock", "Eagle", "Sparrow"]; correctAnswer = 1 },
      { id = "gen_q08"; categoryId = "general"; text = "गंगा नदी कहाँ से निकलती है?"; options = ["Yamunotri", "Gangotri", "Haridwar", "Rishikesh"]; correctAnswer = 1 },
      { id = "gen_q09"; categoryId = "general"; text = "विश्व का सबसे बड़ा देश?"; options = ["USA", "China", "Canada", "Russia"]; correctAnswer = 3 },
      { id = "gen_q10"; categoryId = "general"; text = "भारत का राष्ट्रीय खेल?"; options = ["Cricket", "Hockey", "Football", "Badminton"]; correctAnswer = 1 },
      { id = "gen_q11"; categoryId = "general"; text = "चाँद पर पहला इंसान?"; options = ["Buzz Aldrin", "Neil Armstrong", "Yuri Gagarin", "John Glenn"]; correctAnswer = 1 },
      { id = "gen_q12"; categoryId = "general"; text = "भारत की पहली महिला प्रधानमंत्री?"; options = ["Sarojini Naidu", "Pratibha Patil", "Indira Gandhi", "Sonia Gandhi"]; correctAnswer = 2 },
      { id = "gen_q13"; categoryId = "general"; text = "ISRO किस देश की संस्था है?"; options = ["USA", "Russia", "India", "China"]; correctAnswer = 2 },
      { id = "gen_q14"; categoryId = "general"; text = "सबसे लंबी नदी?"; options = ["Amazon", "Yangtze", "Mississippi", "Nile"]; correctAnswer = 3 },
      { id = "gen_q15"; categoryId = "general"; text = "भारत का राष्ट्रीय फल?"; options = ["Banana", "Mango", "Papaya", "Apple"]; correctAnswer = 1 },
      { id = "gen_q16"; categoryId = "general"; text = "सबसे बड़ा महाद्वीप?"; options = ["Africa", "Asia", "Europe", "Australia"]; correctAnswer = 1 },
      { id = "gen_q17"; categoryId = "general"; text = "सबसे छोटा देश?"; options = ["Monaco", "San Marino", "Vatican City", "Liechtenstein"]; correctAnswer = 2 },
      { id = "gen_q18"; categoryId = "general"; text = "भारत का राष्ट्रीय फूल?"; options = ["Rose", "Jasmine", "Lotus", "Marigold"]; correctAnswer = 2 },
      { id = "gen_q19"; categoryId = "general"; text = "पानी का रासायनिक सूत्र?"; options = ["H2O2", "HO", "H2O", "CO2"]; correctAnswer = 2 },
      { id = "gen_q20"; categoryId = "general"; text = "पृथ्वी का उपग्रह?"; options = ["Sun", "Mars", "Moon", "Venus"]; correctAnswer = 2 },

      // Science (21-40)
      { id = "sci_q01"; categoryId = "science"; text = "मनुष्य के शरीर में कितनी हड्डियाँ होती हैं?"; options = ["196", "200", "206", "212"]; correctAnswer = 2 },
      { id = "sci_q02"; categoryId = "science"; text = "पानी का boiling point?"; options = ["90°C", "100°C", "110°C", "120°C"]; correctAnswer = 1 },
      { id = "sci_q03"; categoryId = "science"; text = "पृथ्वी सूर्य का चक्कर कितने दिन में लगाती है?"; options = ["300 days", "365 days", "400 days", "366 days"]; correctAnswer = 1 },
      { id = "sci_q04"; categoryId = "science"; text = "प्रकाश की गति?"; options = ["3x10^6 m/s", "3x10^7 m/s", "3x10^8 m/s", "3x10^9 m/s"]; correctAnswer = 2 },
      { id = "sci_q05"; categoryId = "science"; text = "DNA का पूरा नाम?"; options = ["Deoxyribonucleic Acid", "Deoxyribonicotinic Acid", "Diribonucleic Acid", "None of these"]; correctAnswer = 0 },
      { id = "sci_q06"; categoryId = "science"; text = "सबसे बड़ा अंग?"; options = ["Heart", "Liver", "Skin", "Lungs"]; correctAnswer = 2 },
      { id = "sci_q07"; categoryId = "science"; text = "Vitamin C का स्रोत?"; options = ["Banana", "Orange", "Apple", "Mango"]; correctAnswer = 1 },
      { id = "sci_q08"; categoryId = "science"; text = "इलेक्ट्रॉन की खोज किसने की?"; options = ["Newton", "Einstein", "J.J. Thomson", "Bohr"]; correctAnswer = 2 },
      { id = "sci_q09"; categoryId = "science"; text = "गुरुत्वाकर्षण की खोज?"; options = ["Newton", "Einstein", "Galileo", "Kepler"]; correctAnswer = 0 },
      { id = "sci_q10"; categoryId = "science"; text = "CO2 क्या है?"; options = ["Carbon Monoxide", "Carbon Dioxide", "Carbon Tetrachloride", "Carbonic Acid"]; correctAnswer = 1 },
      { id = "sci_q11"; categoryId = "science"; text = "पानी जमता है?"; options = ["-10°C", "0°C", "4°C", "10°C"]; correctAnswer = 1 },
      { id = "sci_q12"; categoryId = "science"; text = "ध्वनि किसमें चलती है?"; options = ["Vacuum", "Medium", "Space", "Light"]; correctAnswer = 1 },
      { id = "sci_q13"; categoryId = "science"; text = "बिजली का unit?"; options = ["Joule", "Newton", "Watt", "Ampere"]; correctAnswer = 2 },
      { id = "sci_q14"; categoryId = "science"; text = "रक्त का रंग क्यों लाल है?"; options = ["Plasma", "Platelets", "Hemoglobin", "White blood cells"]; correctAnswer = 2 },
      { id = "sci_q15"; categoryId = "science"; text = "हृदय का काम?"; options = ["Digest food", "Pump blood", "Filter blood", "Store energy"]; correctAnswer = 1 },
      { id = "sci_q16"; categoryId = "science"; text = "इंसान कितने इंद्रियों से महसूस करता है?"; options = ["3", "4", "5", "6"]; correctAnswer = 2 },
      { id = "sci_q17"; categoryId = "science"; text = "सबसे हल्की गैस?"; options = ["Helium", "Oxygen", "Hydrogen", "Nitrogen"]; correctAnswer = 2 },
      { id = "sci_q18"; categoryId = "science"; text = "सूरज क्या है?"; options = ["Planet", "Moon", "Star", "Satellite"]; correctAnswer = 2 },
      { id = "sci_q19"; categoryId = "science"; text = "पौधे क्या बनाते हैं?"; options = ["CO2", "Nitrogen", "Oxygen", "Hydrogen"]; correctAnswer = 2 },
      { id = "sci_q20"; categoryId = "science"; text = "बल का unit?"; options = ["Watt", "Joule", "Pascal", "Newton"]; correctAnswer = 3 },

      // Math (41-60)
      { id = "math_q01"; categoryId = "math"; text = "2 + 2 = ?"; options = ["3", "4", "5", "6"]; correctAnswer = 1 },
      { id = "math_q02"; categoryId = "math"; text = "5 x 6 = ?"; options = ["25", "28", "30", "35"]; correctAnswer = 2 },
      { id = "math_q03"; categoryId = "math"; text = "10 / 2 = ?"; options = ["3", "4", "5", "6"]; correctAnswer = 2 },
      { id = "math_q04"; categoryId = "math"; text = "9^2 = ?"; options = ["72", "81", "90", "99"]; correctAnswer = 1 },
      { id = "math_q05"; categoryId = "math"; text = "12 x 12 = ?"; options = ["124", "132", "144", "156"]; correctAnswer = 2 },
      { id = "math_q06"; categoryId = "math"; text = "100 / 10 = ?"; options = ["5", "8", "10", "12"]; correctAnswer = 2 },
      { id = "math_q07"; categoryId = "math"; text = "7 + 8 = ?"; options = ["13", "14", "15", "16"]; correctAnswer = 2 },
      { id = "math_q08"; categoryId = "math"; text = "15 - 5 = ?"; options = ["8", "9", "10", "11"]; correctAnswer = 2 },
      { id = "math_q09"; categoryId = "math"; text = "3^3 = ?"; options = ["9", "18", "27", "36"]; correctAnswer = 2 },
      { id = "math_q10"; categoryId = "math"; text = "20% of 100 = ?"; options = ["10", "15", "20", "25"]; correctAnswer = 2 },
      { id = "math_q11"; categoryId = "math"; text = "Root of 16 = ?"; options = ["2", "3", "4", "8"]; correctAnswer = 2 },
      { id = "math_q12"; categoryId = "math"; text = "50 + 50 = ?"; options = ["90", "95", "100", "110"]; correctAnswer = 2 },
      { id = "math_q13"; categoryId = "math"; text = "8 x 8 = ?"; options = ["56", "62", "64", "72"]; correctAnswer = 2 },
      { id = "math_q14"; categoryId = "math"; text = "90 / 9 = ?"; options = ["8", "9", "10", "11"]; correctAnswer = 2 },
      { id = "math_q15"; categoryId = "math"; text = "11 x 11 = ?"; options = ["111", "121", "131", "141"]; correctAnswer = 1 },
      { id = "math_q16"; categoryId = "math"; text = "1000 / 100 = ?"; options = ["5", "10", "15", "20"]; correctAnswer = 1 },
      { id = "math_q17"; categoryId = "math"; text = "25 x 4 = ?"; options = ["75", "80", "100", "120"]; correctAnswer = 2 },
      { id = "math_q18"; categoryId = "math"; text = "6^2 = ?"; options = ["24", "30", "36", "42"]; correctAnswer = 2 },
      { id = "math_q19"; categoryId = "math"; text = "18 / 3 = ?"; options = ["4", "5", "6", "7"]; correctAnswer = 2 },
      { id = "math_q20"; categoryId = "math"; text = "7 x 7 = ?"; options = ["42", "49", "56", "63"]; correctAnswer = 1 },

      // Computer (61-80)
      { id = "comp_q01"; categoryId = "computer"; text = "CPU का पूरा नाम?"; options = ["Central Processing Unit", "Computer Unit", "Control Unit", "None"]; correctAnswer = 0 },
      { id = "comp_q02"; categoryId = "computer"; text = "Computer का दिमाग?"; options = ["RAM", "ROM", "CPU", "HDD"]; correctAnswer = 2 },
      { id = "comp_q03"; categoryId = "computer"; text = "Keyboard क्या है?"; options = ["Output device", "Input device", "Storage device", "Processing unit"]; correctAnswer = 1 },
      { id = "comp_q04"; categoryId = "computer"; text = "Mouse क्या है?"; options = ["Output device", "Input device", "Storage device", "Processing unit"]; correctAnswer = 1 },
      { id = "comp_q05"; categoryId = "computer"; text = "Monitor क्या है?"; options = ["Input device", "Output device", "Storage device", "Processing unit"]; correctAnswer = 1 },
      { id = "comp_q06"; categoryId = "computer"; text = "RAM क्या है?"; options = ["Storage", "Memory", "Processor", "Display"]; correctAnswer = 1 },
      { id = "comp_q07"; categoryId = "computer"; text = "Internet क्या है?"; options = ["Software", "Hardware", "Network", "Application"]; correctAnswer = 2 },
      { id = "comp_q08"; categoryId = "computer"; text = "WWW का मतलब?"; options = ["World Wide Web", "World Wide Wire", "Wide World Web", "World Web Wide"]; correctAnswer = 0 },
      { id = "comp_q09"; categoryId = "computer"; text = "Software क्या है?"; options = ["Physical parts", "Programs", "Devices", "Cables"]; correctAnswer = 1 },
      { id = "comp_q10"; categoryId = "computer"; text = "Hardware क्या है?"; options = ["Programs", "Data", "Physical parts", "Files"]; correctAnswer = 2 },
      { id = "comp_q11"; categoryId = "computer"; text = "Email किसके लिए?"; options = ["Storage", "Communication", "Processing", "Display"]; correctAnswer = 1 },
      { id = "comp_q12"; categoryId = "computer"; text = "Google क्या है?"; options = ["Social media", "Search engine", "Email service", "Browser"]; correctAnswer = 1 },
      { id = "comp_q13"; categoryId = "computer"; text = "Windows क्या है?"; options = ["Application", "Browser", "Operating system", "Game"]; correctAnswer = 2 },
      { id = "comp_q14"; categoryId = "computer"; text = "Android क्या है?"; options = ["App", "Browser", "Game", "OS"]; correctAnswer = 3 },
      { id = "comp_q15"; categoryId = "computer"; text = "File क्या है?"; options = ["Program", "Hardware", "Data", "Network"]; correctAnswer = 2 },
      { id = "comp_q16"; categoryId = "computer"; text = "Virus क्या है?"; options = ["Useful program", "Hardware", "Malicious program", "Data"]; correctAnswer = 2 },
      { id = "comp_q17"; categoryId = "computer"; text = "USB क्या है?"; options = ["Output device", "Input device", "Storage device", "Network device"]; correctAnswer = 2 },
      { id = "comp_q18"; categoryId = "computer"; text = "Cloud क्या है?"; options = ["Physical storage", "Online storage", "Local network", "Software"]; correctAnswer = 1 },
      { id = "comp_q19"; categoryId = "computer"; text = "App क्या है?"; options = ["Hardware", "Network", "Application", "Database"]; correctAnswer = 2 },
      { id = "comp_q20"; categoryId = "computer"; text = "Database क्या है?"; options = ["Single file", "Program", "Physical device", "Data collection"]; correctAnswer = 3 },

      // Fun / Mixed (81-100)
      { id = "fun_q01"; categoryId = "fun"; text = "शेर को क्या कहते हैं?"; options = ["Tiger", "Lion", "Leopard", "Cheetah"]; correctAnswer = 1 },
      { id = "fun_q02"; categoryId = "fun"; text = "गाय क्या देती है?"; options = ["Eggs", "Milk", "Wool", "Honey"]; correctAnswer = 1 },
      { id = "fun_q03"; categoryId = "fun"; text = "कुत्ता क्या करता है?"; options = ["Moo", "Bark", "Roar", "Meow"]; correctAnswer = 1 },
      { id = "fun_q04"; categoryId = "fun"; text = "भारत का सबसे लोकप्रिय खेल?"; options = ["Hockey", "Cricket", "Football", "Tennis"]; correctAnswer = 1 },
      { id = "fun_q05"; categoryId = "fun"; text = "लाल किला कहाँ है?"; options = ["Mumbai", "Delhi", "Agra", "Jaipur"]; correctAnswer = 1 },
      { id = "fun_q06"; categoryId = "fun"; text = "दीपावली किसका त्योहार है?"; options = ["Colors", "Lights", "Water", "Music"]; correctAnswer = 1 },
      { id = "fun_q07"; categoryId = "fun"; text = "होली में क्या खेलते हैं?"; options = ["Water", "Colors", "Fire", "Sand"]; correctAnswer = 1 },
      { id = "fun_q08"; categoryId = "fun"; text = "कौन उड़ता है?"; options = ["Fish", "Dog", "Bird", "Horse"]; correctAnswer = 2 },
      { id = "fun_q09"; categoryId = "fun"; text = "कौन तैरता है?"; options = ["Fish", "Cat", "Dog", "Bird"]; correctAnswer = 0 },
      { id = "fun_q10"; categoryId = "fun"; text = "कौन दौड़ता है?"; options = ["Turtle", "Fish", "Horse", "Snail"]; correctAnswer = 2 },
      { id = "fun_q11"; categoryId = "fun"; text = "मोबाइल किसके लिए?"; options = ["Cooking", "Communication", "Exercise", "Sleeping"]; correctAnswer = 1 },
      { id = "fun_q12"; categoryId = "fun"; text = "ट्रेन किस पर चलती है?"; options = ["Road", "Water", "Track", "Air"]; correctAnswer = 2 },
      { id = "fun_q13"; categoryId = "fun"; text = "कार क्या है?"; options = ["Food", "Animal", "Vehicle", "Building"]; correctAnswer = 2 },
      { id = "fun_q14"; categoryId = "fun"; text = "पानी का रंग?"; options = ["Blue", "Green", "Colorless", "White"]; correctAnswer = 2 },
      { id = "fun_q15"; categoryId = "fun"; text = "आसमान का रंग?"; options = ["Green", "Blue", "Red", "Yellow"]; correctAnswer = 1 },
      { id = "fun_q16"; categoryId = "fun"; text = "पत्तों का रंग?"; options = ["Green", "Blue", "Yellow", "Purple"]; correctAnswer = 0 },
      { id = "fun_q17"; categoryId = "fun"; text = "आग का रंग?"; options = ["Blue", "Red", "Green", "White"]; correctAnswer = 1 },
      { id = "fun_q18"; categoryId = "fun"; text = "बर्फ का रंग?"; options = ["Blue", "Yellow", "Red", "White"]; correctAnswer = 3 },
      { id = "fun_q19"; categoryId = "fun"; text = "रात में क्या होता है?"; options = ["Light", "Dark", "Hot", "Rainy"]; correctAnswer = 1 },
      { id = "fun_q20"; categoryId = "fun"; text = "दिन में क्या होता है?"; options = ["Light", "Dark", "Cold", "Windy"]; correctAnswer = 0 },
    ];

    for (question in allQuestions.values()) {
      questions.add(question.id, question);
    };
  };

  public query ({ caller }) func getCategories() : async [Category] {
    categories.values().toArray().sort();
  };

  public query ({ caller }) func getQuestionsByCategory(categoryId : Text) : async [Question] {
    questions.values().toArray().filter(
      func(q) { q.categoryId == categoryId }
    ).sort();
  };

  public query ({ caller }) func getQuestionById(questionId : Text) : async Question {
    switch (questions.get(questionId)) {
      case (null) { Runtime.trap("Question not found") };
      case (?question) { question };
    };
  };

  public shared ({ caller }) func submitScore(name : Text, score : Nat, total : Nat, category : Text) : async Bool {
    let percentage = if (total == 0) { 0.0 } else {
      score.toFloat() / total.toFloat() * 100.0;
    };

    let newEntry : LeaderboardEntry = {
      name;
      score;
      total;
      percentage;
      category;
      timestamp = Time.now();
    };

    let entries = leaderboard.values().toArray();
    let newEntries = entries.concat([newEntry]).sort();

    let filteredEntries = Array.tabulate(
      if (newEntries.size() >= 20) { 20 } else {
        newEntries.size();
      },
      func(i) { newEntries[i] },
    );

    leaderboard.clear();

    for (entry in filteredEntries.values()) {
      leaderboard.add(entry);
    };
    true;
  };

  public query ({ caller }) func getLeaderboard() : async [LeaderboardEntry] {
    leaderboard.toArray();
  };

  public shared ({ caller }) func clearLeaderboard() : async () {
    leaderboard.clear();
  };

  // Community Posts
  public shared ({ caller }) func createPost(author : Text, content : Text, tags : [Text]) : async Post {
    let timestamp = Time.now();
    let postId = author.concat(timestamp.toText()).concat("post");
    let newPost : Post = {
      id = postId;
      author;
      content;
      likes = 0;
      timestamp;
      tags;
    };
    posts.add(postId, newPost);
    newPost;
  };

  public query ({ caller }) func getPosts() : async [Post] {
    posts.values().toArray().sort().sliceToArray(0, if (50 < posts.size()) { 50 } else { posts.size() });
  };

  public shared ({ caller }) func likePost(postId : Text) : async Bool {
    switch (posts.get(postId)) {
      case (null) { false };
      case (?post) {
        let updatedPost = { post with likes = post.likes + 1 };
        posts.add(postId, updatedPost);
        true;
      };
    };
  };

  public query ({ caller }) func getStockSignals() : async [StockSignal] {
    let signals = [
      {
        ticker = "RELIANCE";
        name = "Reliance Industries Ltd";
        signal = "BUY";
        entry = 2400.0;
        target = 2500.0;
        stoploss = 2350.0;
        strength = 85;
        reason = "Strong uptrend, positive market sentiment";
        timeframe = "Medium-term";
        updatedAt = Time.now();
      },
      {
        ticker = "TCS";
        name = "Tata Consultancy Services";
        signal = "HOLD";
        entry = 3200.0;
        target = 3300.0;
        stoploss = 3150.0;
        strength = 65;
        reason = "Stable performance, consolidating phase";
        timeframe = "Short-term";
        updatedAt = Time.now();
      },
      {
        ticker = "HDFCBANK";
        name = "HDFC Bank Ltd";
        signal = "SELL";
        entry = 1500.0;
        target = 1450.0;
        stoploss = 1520.0;
        strength = 75;
        reason = "Weak quarterly results, bearish trend";
        timeframe = "Long-term";
        updatedAt = Time.now();
      },
      {
        ticker = "INFY";
        name = "Infosys Ltd";
        signal = "BUY";
        entry = 1700.0;
        target = 1800.0;
        stoploss = 1680.0;
        strength = 80;
        reason = "Positive earnings, strong fundamentals";
        timeframe = "Medium-term";
        updatedAt = Time.now();
      },
      {
        ticker = "TATAMOTORS";
        name = "Tata Motors Ltd";
        signal = "HOLD";
        entry = 850.0;
        target = 900.0;
        stoploss = 830.0;
        strength = 60;
        reason = "Sideways movement, waiting for breakout";
        timeframe = "Short-term";
        updatedAt = Time.now();
      },
      {
        ticker = "SBIN";
        name = "State Bank of India";
        signal = "BUY";
        entry = 600.0;
        target = 650.0;
        stoploss = 590.0;
        strength = 90;
        reason = "Strong financials, sector leader";
        timeframe = "Long-term";
        updatedAt = Time.now();
      },
      {
        ticker = "ICICIBANK";
        name = "ICICI Bank Ltd";
        signal = "SELL";
        entry = 900.0;
        target = 880.0;
        stoploss = 910.0;
        strength = 70;
        reason = "Overbought, correction expected";
        timeframe = "Medium-term";
        updatedAt = Time.now();
      },
      {
        ticker = "AXISBANK";
        name = "Axis Bank Ltd";
        signal = "BUY";
        entry = 800.0;
        target = 850.0;
        stoploss = 790.0;
        strength = 85;
        reason = "Strong institutional buying";
        timeframe = "Short-term";
        updatedAt = Time.now();
      },
      {
        ticker = "WIPRO";
        name = "Wipro Ltd";
        signal = "HOLD";
        entry = 400.0;
        target = 420.0;
        stoploss = 390.0;
        strength = 55;
        reason = "Low volatility, wait and watch";
        timeframe = "Medium-term";
        updatedAt = Time.now();
      },
      {
        ticker = "BAJFINANCE";
        name = "Bajaj Finance Ltd";
        signal = "BUY";
        entry = 7000.0;
        target = 7200.0;
        stoploss = 6950.0;
        strength = 78;
        reason = "Strong growth potential";
        timeframe = "Long-term";
        updatedAt = Time.now();
      },
      {
        ticker = "HINDUNILVR";
        name = "Hindustan Unilever Ltd";
        signal = "SELL";
        entry = 2500.0;
        target = 2450.0;
        stoploss = 2520.0;
        strength = 65;
        reason = "Weak demand, sector underperformance";
        timeframe = "Short-term";
        updatedAt = Time.now();
      },
      {
        ticker = "MARUTI";
        name = "Maruti Suzuki India Ltd";
        signal = "BUY";
        entry = 9500.0;
        target = 9700.0;
        stoploss = 9450.0;
        strength = 88;
        reason = "New model launch, positive outlook";
        timeframe = "Medium-term";
        updatedAt = Time.now();
      },
      {
        ticker = "SUNPHARMA";
        name = "Sun Pharmaceutical Industries Ltd";
        signal = "HOLD";
        entry = 800.0;
        target = 820.0;
        stoploss = 790.0;
        strength = 58;
        reason = "Stable earnings, sector rotation";
        timeframe = "Short-term";
        updatedAt = Time.now();
      },
      {
        ticker = "ADANIENT";
        name = "Adani Enterprises Ltd";
        signal = "BUY";
        entry = 2000.0;
        target = 2100.0;
        stoploss = 1970.0;
        strength = 82;
        reason = "Expansion plans, high growth sector";
        timeframe = "Long-term";
        updatedAt = Time.now();
      },
      {
        ticker = "LT";
        name = "Larsen & Toubro Ltd";
        signal = "BUY";
        entry = 2500.0;
        target = 2600.0;
        stoploss = 2470.0;
        strength = 80;
        reason = "Strong order book, sector leader";
        timeframe = "Medium-term";
        updatedAt = Time.now();
      },
    ];

    signals;
  };
};
