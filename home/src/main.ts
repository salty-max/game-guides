// The page's one script: its stylesheet, the Find field over the guides, and a returning reader's progress on them, from the cookies and,
// on a browser linked by sync, from its group.
import "./home.css";
import { wireFind } from "./find";
import { wireGroup, wireProgress } from "./progress";

wireFind();
wireProgress();
void wireGroup();
