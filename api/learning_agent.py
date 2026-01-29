#!/usr/bin/env python3

import json
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Any, Optional
import uuid


class AdaptiveLearningAgent:
    def __init__(self, curriculum_path="curriculum"):
        self.curriculum_path = Path(curriculum_path)
        self.profiles_path = Path("profiles")
        self.profiles_path.mkdir(exist_ok=True)

        self.knowledge_graph = self.load_knowledge_graph()
        self.page_index = self.load_page_index()

    def load_knowledge_graph(self):
        graph_file = self.curriculum_path / "knowledge_graph.json"
        if graph_file.exists():
            with open(graph_file) as f:
                return json.load(f)
        return {"nodes": []}

    def load_page_index(self):
        index_file = self.curriculum_path / "page_index.json"
        if index_file.exists():
            with open(index_file) as f:
                return json.load(f)
        return {"node_to_page": {}}

    def load_student_profile(self, student_id: str) -> Dict:
        profile_file = self.profiles_path / f"{student_id}.json"
        if profile_file.exists():
            with open(profile_file) as f:
                return json.load(f)

        return self.create_new_profile(student_id)

    def create_new_profile(self, student_id: str) -> Dict:
        return {
            "student_id": student_id,
            "graph_id": self.knowledge_graph.get("graph_id", "db_mgmt_v1"),
            "last_updated": datetime.now(timezone.utc).isoformat(),
            "mastery": {},
            "interests": [],
            "tone": "balanced",
            "context_window": [],
            "last_page_number": 1,
            "last_node_id": None,
            "learned": {
                "what_works": {
                    "analogy_domains": [],
                    "explanation_style": "balanced",
                    "challenge_difficulty": "medium",
                    "recent_wins": [],
                },
                "what_fails": {
                    "confusion_triggers": [],
                    "weak_node_types": [],
                    "retry_count_by_node": {},
                },
                "inferred_preferences": {
                    "pace": "medium",
                    "depth": "balanced",
                    "modality": "mixed",
                    "analogy_affinity": 0.5,
                },
                "per_concept_hints": {},
                "interaction_count": 0,
            },
        }

    def save_student_profile(self, profile: Dict):
        profile["last_updated"] = datetime.now(timezone.utc).isoformat()
        profile_file = self.profiles_path / f"{profile['student_id']}.json"
        with open(profile_file, "w") as f:
            json.dump(profile, f, indent=2)

    def process_quiz_response(
        self, student_id: str, response: Dict, context: Dict
    ) -> Dict:
        profile = self.load_student_profile(student_id)

        question_id = response["questionId"]
        selected_option = response["selectedOption"]
        time_spent = response.get("timeSpent", 0)

        node_id = self.extract_node_from_question_id(question_id)
        correct_answer = self.get_correct_answer(node_id, question_id)

        is_correct = selected_option == correct_answer

        adaptations = self.update_learning_model(
            profile, node_id, question_id, is_correct, time_spent, selected_option
        )

        self.save_student_profile(profile)

        return {
            "success": True,
            "is_correct": is_correct,
            "correct_answer": correct_answer,
            "adaptations": adaptations,
            "updated_profile": profile,
        }

    def extract_node_from_question_id(self, question_id: str) -> str:
        if "db_chapter_01" in question_id:
            question_num = int(question_id.split("_q")[1])
            node_mapping = {
                1: "db_001_data_vs_information",
                2: "db_002_database_definition",
                3: "db_003_dbms_roles",
                4: "db_004_advantages_challenges",
                5: "db_003_dbms_roles",
                6: "db_001_data_vs_information",
                7: "db_002_database_definition",
                8: "db_002_database_definition",
                9: "db_004_advantages_challenges",
                10: "db_001_data_vs_information",
            }
            return node_mapping.get(question_num, "db_001_data_vs_information")
        elif "db_chapter_02" in question_id:
            question_num = int(question_id.split("_q")[1])
            node_mapping = {
                1: "db_011_keys_overview",
                2: "db_012_integrity_rules",
                3: "db_012_integrity_rules",
                4: "db_013_relational_algebra",
                5: "db_010_tables_relations",
                6: "db_011_keys_overview",
                7: "db_013_relational_algebra",
                8: "db_011_keys_overview",
                9: "db_013_relational_algebra",
                10: "db_012_integrity_rules",
            }
            return node_mapping.get(question_num, "db_010_tables_relations")
        elif "db_chapter_03" in question_id:
            question_num = int(question_id.split("_q")[1])
            node_mapping = {
                1: "db_020_sql_intro",
                2: "db_020_sql_intro",
                3: "db_021_sql_ddl",
                4: "db_022_sql_select_basics",
                5: "db_022_sql_select_basics",
                6: "db_023_sql_aggregates_groupby",
                7: "db_022_sql_select_basics",
                8: "db_022_sql_select_basics",
                9: "db_022_sql_select_basics",
                10: "db_022_sql_select_basics",
            }
            return node_mapping.get(question_num, "db_020_sql_intro")

        return "unknown_node"

    def get_correct_answer(self, node_id: str, question_id: str) -> str:
        answer_key = {
            "db_chapter_01_q1": "C",
            "db_chapter_01_q2": "B",
            "db_chapter_01_q3": "C",
            "db_chapter_01_q4": "C",
            "db_chapter_01_q5": "C",
            "db_chapter_01_q6": "B",
            "db_chapter_01_q7": "B",
            "db_chapter_01_q8": "B",
            "db_chapter_01_q9": "C",
            "db_chapter_01_q10": "C",
            "db_chapter_02_q1": "C",
            "db_chapter_02_q2": "B",
            "db_chapter_02_q3": "C",
            "db_chapter_02_q4": "B",
            "db_chapter_02_q5": "D",
            "db_chapter_02_q6": "A",
            "db_chapter_02_q7": "B",
            "db_chapter_02_q8": "C",
            "db_chapter_02_q9": "B",
            "db_chapter_02_q10": "C",
            "db_chapter_03_q1": "B",
            "db_chapter_03_q2": "B",
            "db_chapter_03_q3": "B",
            "db_chapter_03_q4": "B",
            "db_chapter_03_q5": "C",
            "db_chapter_03_q6": "C",
            "db_chapter_03_q7": "C",
            "db_chapter_03_q8": "B",
            "db_chapter_03_q9": "D",
            "db_chapter_03_q10": "C",
        }
        return answer_key.get(question_id, "A")

    def update_learning_model(
        self,
        profile: Dict,
        node_id: str,
        question_id: str,
        is_correct: bool,
        time_spent: int,
        selected_option: str,
    ) -> Dict:
        learned = profile["learned"]
        adaptations = {}

        learned["interaction_count"] += 1

        if is_correct:
            profile["mastery"][node_id] = min(
                1.0, profile["mastery"].get(node_id, 0) + 0.3
            )

            learned["what_works"]["recent_wins"].append(
                {
                    "node_id": node_id,
                    "summary": f"Correct answer on {question_id}",
                    "at": datetime.now(timezone.utc).isoformat(),
                }
            )

            if len(learned["what_works"]["recent_wins"]) > 5:
                learned["what_works"]["recent_wins"] = learned["what_works"][
                    "recent_wins"
                ][-5:]

        else:
            retry_count = (
                learned["what_fails"]["retry_count_by_node"].get(node_id, 0) + 1
            )
            learned["what_fails"]["retry_count_by_node"][node_id] = retry_count

            if retry_count >= 2:
                adaptations["show_hint"] = {
                    "question_id": question_id,
                    "message": self.generate_hint_for_node(node_id, profile),
                }

                remediation_node = self.get_remediation_node(node_id)
                if remediation_node:
                    adaptations["recommend_review"] = {
                        "node_id": remediation_node,
                        "reason": "Multiple incorrect attempts suggest reviewing fundamentals",
                    }

        if time_spent > 60000:
            if learned["inferred_preferences"]["pace"] != "slow":
                learned["inferred_preferences"]["pace"] = "slow"
                adaptations["adjust_difficulty"] = "slower_pacing"
        elif time_spent < 15000:
            if learned["inferred_preferences"]["pace"] != "fast":
                learned["inferred_preferences"]["pace"] = "fast"

        return adaptations

    def generate_hint_for_node(self, node_id: str, profile: Dict) -> str:
        hints = {
            "db_001_data_vs_information": "Think about raw facts (data) vs processed facts that help decisions (information)",
            "db_002_database_definition": "A database combines both the actual data AND the descriptions of that data",
            "db_003_dbms_roles": "DBMS handles storage, security, backup, and multi-user access",
            "db_010_tables_relations": "Tables have rows (records) and columns (fields) with specific rules",
            "db_011_keys_overview": "Primary keys identify each row uniquely, foreign keys link to other tables",
            "db_020_sql_intro": "SQL is the universal language for talking to relational databases",
        }

        base_hint = hints.get(
            node_id,
            "Review the concept and try to identify the key distinguishing features",
        )

        if profile["learned"]["what_works"]["analogy_domains"]:
            domain = profile["learned"]["what_works"]["analogy_domains"][0]
            base_hint += f" (think of examples from {domain})"

        return base_hint

    def get_remediation_node(self, node_id: str) -> Optional[str]:
        remediation_map = {
            "db_011_keys_overview": "db_011a_primary_keys_focus",
            "db_022_sql_select_basics": "db_022r_select_recap",
        }
        return remediation_map.get(node_id)


def create_flask_app():
    try:
        from flask import Flask, request, jsonify
        from flask_cors import CORS
    except ImportError:
        print("Flask not installed. Run: pip install flask flask-cors")
        return None

    app = Flask(__name__)
    CORS(app)

    agent = AdaptiveLearningAgent()

    @app.route("/api/learning-agent", methods=["POST"])
    def handle_quiz_response():
        data = request.get_json()

        student_id = data.get("student_id")
        response = data.get("response")
        context = data.get("context", {})

        if not student_id or not response:
            return jsonify({"error": "Missing student_id or response"}), 400

        result = agent.process_quiz_response(student_id, response, context)
        return jsonify(result)

    @app.route("/api/student-profile/<student_id>", methods=["GET"])
    def get_student_profile(student_id):
        profile = agent.load_student_profile(student_id)
        return jsonify(profile)

    return app


if __name__ == "__main__":
    app = create_flask_app()
    if app:
        print("Starting adaptive learning agent server...")
        print("Quiz responses will be processed and stored in profiles/")
        app.run(debug=True, port=5001)
    else:
        print("Install Flask to run the learning agent server")
