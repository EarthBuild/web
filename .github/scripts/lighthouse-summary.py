#!/usr/bin/env python3
import glob
import json
import os
import subprocess
import sys
import urllib.parse


def format_score(score):
    if score is None:
        return "N/A", False
    pct = int(round(score * 100))
    if pct >= 90:
        return f"{pct}", True
    elif pct >= 50:
        return f"{pct} ⚠️", False
    else:
        return f"{pct} ❌", False


def combine_cell(m_tuple, d_tuple, both_devices):
    if both_devices and m_tuple and d_tuple:
        m_txt, m_green = m_tuple
        d_txt, d_green = d_tuple
        if m_green and d_green:
            return f"{m_txt} / {d_txt} ✅"
        else:
            m_disp = m_txt if not m_green else f"{m_txt} ✅"
            d_disp = d_txt if not d_green else f"{d_txt} ✅"
            return f"{m_disp} / {d_disp}"
    elif m_tuple:
        return f"{m_tuple[0]} ✅" if m_tuple[1] else m_tuple[0]
    elif d_tuple:
        return f"{d_tuple[0]} ✅" if d_tuple[1] else d_tuple[0]
    return "N/A"


LIGHTHOUSE_LOGO_URL = "https://raw.githubusercontent.com/GoogleChrome/lighthouse/main/assets/lighthouse-logo.svg"


def generate_summary():
    mobile_dir = ".lighthouseci/mobile"
    desktop_dir = ".lighthouseci/desktop"

    has_mobile = os.path.exists(os.path.join(mobile_dir, "links.json"))
    has_desktop = os.path.exists(os.path.join(desktop_dir, "links.json"))

    if not has_mobile and not has_desktop:
        if os.path.exists(".lighthouseci/links.json"):
            has_mobile = True
            mobile_dir = ".lighthouseci"
        else:
            print("Warning: no Lighthouse links.json found. Skipping summary generation.", file=sys.stderr)
            return None

    def load_device_data(target_dir):
        links_file = os.path.join(target_dir, "links.json")
        if not os.path.exists(links_file):
            return {}

        with open(links_file, "r", encoding="utf-8") as f:
            links = json.load(f)

        report_files = sorted(glob.glob(os.path.join(target_dir, "lhr-*.json")))
        reports = []
        for rf in report_files:
            try:
                with open(rf, "r", encoding="utf-8") as f:
                    reports.append(json.load(f))
            except Exception as e:
                print(f"Warning: could not read {rf}: {e}", file=sys.stderr)

        results = {}
        for link_url, report_url in links.items():
            parsed = urllib.parse.urlparse(link_url)
            route_path = parsed.path or "/"

            matched_data = None
            for data in reversed(reports):
                data_req_path = urllib.parse.urlparse(data.get("requestedUrl", "")).path or "/"
                data_fin_path = urllib.parse.urlparse(data.get("finalUrl", "")).path or "/"
                if route_path in (data_req_path, data_fin_path):
                    matched_data = data
                    break

            if matched_data:
                cats = matched_data.get("categories", {})
                perf = format_score(cats.get("performance", {}).get("score"))
                a11y = format_score(cats.get("accessibility", {}).get("score"))
                bp = format_score(cats.get("best-practices", {}).get("score"))
                seo = format_score(cats.get("seo", {}).get("score"))
                results[route_path] = {
                    "perf": perf,
                    "a11y": a11y,
                    "bp": bp,
                    "seo": seo,
                    "all_green": perf[1] and a11y[1] and bp[1] and seo[1],
                    "report_url": report_url,
                }
            else:
                na = ("N/A", False)
                results[route_path] = {
                    "perf": na,
                    "a11y": na,
                    "bp": na,
                    "seo": na,
                    "all_green": False,
                    "report_url": report_url,
                }
        return results

    mobile_data = load_device_data(mobile_dir) if has_mobile else {}
    desktop_data = load_device_data(desktop_dir) if has_desktop else {}

    all_routes = sorted(set(list(mobile_data.keys()) + list(desktop_data.keys())))
    if "/" in all_routes:
        all_routes.remove("/")
        all_routes.insert(0, "/")

    rows = []
    both_devices = bool(mobile_data and desktop_data)
    all_green = True

    for route in all_routes:
        m = mobile_data.get(route)
        d = desktop_data.get(route)

        if both_devices:
            if not m or not m.get("all_green", False):
                all_green = False
            if not d or not d.get("all_green", False):
                all_green = False
        else:
            if m and not m.get("all_green", False):
                all_green = False
            if d and not d.get("all_green", False):
                all_green = False

        route_cell = f"`{route}`"
        if both_devices and m and d:
            perf_cell = combine_cell(m["perf"], d["perf"], True)
            a11y_cell = combine_cell(m["a11y"], d["a11y"], True)
            bp_cell = combine_cell(m["bp"], d["bp"], True)
            seo_cell = combine_cell(m["seo"], d["seo"], True)
            reports_cell = f'[📱]({m["report_url"]} "Mobile Report") [💻]({d["report_url"]} "Desktop Report")'
        elif m:
            perf_cell = combine_cell(m["perf"], None, False)
            a11y_cell = combine_cell(m["a11y"], None, False)
            bp_cell = combine_cell(m["bp"], None, False)
            seo_cell = combine_cell(m["seo"], None, False)
            reports_cell = f'[📱]({m["report_url"]} "Mobile Report")'
        elif d:
            perf_cell = combine_cell(None, d["perf"], False)
            a11y_cell = combine_cell(None, d["a11y"], False)
            bp_cell = combine_cell(None, d["bp"], False)
            seo_cell = combine_cell(None, d["seo"], False)
            reports_cell = f'[💻]({d["report_url"]} "Desktop Report")'
        else:
            continue

        rows.append(f"| {route_cell} | {perf_cell} | {a11y_cell} | {bp_cell} | {seo_cell} | {reports_cell} |")

    table_rows = "\n".join(rows)
    footnote = "*Scores: 📱 Mobile / 💻 Desktop. Threshold: ≥ 90 ✅.*" if both_devices else "*Threshold: ≥ 90 ✅.*"
    comment = f"""<!-- lighthouse-ci-summary -->
### <img src="{LIGHTHOUSE_LOGO_URL}" alt="Lighthouse" width="20" height="20" /> Lighthouse

| Route | Perf | A11y | Best | SEO | Reports |
|:---|:---:|:---:|:---:|:---:|:---:|
{table_rows}

{footnote}
"""
    return comment, all_green


def main():
    res = generate_summary()
    if not res:
        print("::error::No Lighthouse CI results found to evaluate.", file=sys.stderr)
        sys.exit(1)
    comment, all_green = res

    # 1. Output to stdout
    print(comment)

    # 2. Append to GitHub Actions Job Summary if running in Actions
    summary_path = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary_path and os.path.exists(os.path.dirname(summary_path)):
        try:
            with open(summary_path, "a", encoding="utf-8") as f:
                f.write(comment + "\n")
            print("Successfully written to $GITHUB_STEP_SUMMARY")
        except Exception as e:
            print(f"Warning: failed to write to GITHUB_STEP_SUMMARY: {e}", file=sys.stderr)

    # 3. Post or update sticky comment on PR if PR_NUMBER is set
    pr_number = os.environ.get("PR_NUMBER")
    if pr_number:
        try:
            cmd = ["gh", "api", f"repos/:owner/:repo/issues/{pr_number}/comments"]
            res_str = subprocess.check_output(cmd, text=True)
            existing_comments = json.loads(res_str)
            comment_id = None
            for c in existing_comments:
                if "<!-- lighthouse-ci-summary -->" in c.get("body", ""):
                    comment_id = c.get("id")
                    break

            if comment_id:
                print(f"Updating existing PR comment #{comment_id} on PR #{pr_number}...")
                subprocess.run(
                    ["gh", "api", "-X", "PATCH", f"repos/:owner/:repo/issues/comments/{comment_id}", "-f", f"body={comment}"],
                    check=True,
                )
            else:
                print(f"Creating new PR comment on PR #{pr_number}...")
                subprocess.run(["gh", "pr", "comment", pr_number, "--body", comment], check=True)
        except subprocess.CalledProcessError as e:
            print(f"Warning: gh command failed: {e}", file=sys.stderr)
        except Exception as e:
            print(f"Warning: unexpected error posting PR comment: {e}", file=sys.stderr)

    # 4. Fail the build if any score is not green (score < 90%)
    if not all_green:
        print("\n::error::Lighthouse CI audit failed: one or more categories scored below 90% (did not pass ✅).", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
