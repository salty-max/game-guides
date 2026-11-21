// The page's one script: its stylesheet, the theme button, the Find field over the guides, and a returning reader's progress on them, from
// the cookies and, on a browser linked by sync, from its group.
import "./home.css";
import { wireFind } from "./find";
import { wireGroup, wireProgress } from "./progress";
import { wireTheme } from "./theme";

wireTheme();
wireFind();
wireProgress();
void wireGroup();
