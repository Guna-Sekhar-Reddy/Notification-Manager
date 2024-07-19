from flask import jsonify, request, render_template, session, redirect, url_for
from . import app, db
from .models import User, UserDevice, Templates, Notification,LoginUser
from .controllers.notification_controller import send_notifications,create_parallel_notifier,get_topics,log_notification,getResult
import json
import json
from sqlalchemy import text
import time
from firebase_admin import messaging
  
@app.route("/templatesfetchfromdb", methods=["GET"])
def temp_fetch():
    print("Fetching templates from the database")
    template = Templates.query.all()
    temp_list = [{"title": i.title, "message": i.message} for i in template]
    print("Templates fetched:", temp_list)
    return jsonify(temp_list)
 
 
@app.route("/pushtemplatetodb", methods=["POST"])
def push_templates():
    json_data = request.get_json()
    print("Received JSON data for templates:", json_data)
    for temp_data in json_data["template"]:
        temp = Templates.query.filter_by(title=temp_data["title"]).first()
        if temp:
            print(f"Updating template with title: {temp_data['title']}")
            temp.message = temp_data["message"]
        else:
            print(f"Inserting new template with title: {temp_data['title']}")
            temp = Templates(title=temp_data["title"], message=temp_data["message"])
            db.session.add(temp)
    db.session.commit()
    return "Data has been inserted/updated successfully."
 
 
@app.route("/pushnotificationtodb", methods=["POST"])
def push_notifications():
    if "username" not in session:
        return jsonify({"error": "Unauthorized access"}), 403
 
    json_data = request.get_json()
    title = json_data["Title"]
    message = json_data["Message"]
    user_ids = json_data["users"]
    username = session["username"]
 
    if not title or not message or not user_ids:
        print("Error: Missing Title, Message, or user IDs")
        return jsonify({"error": "Missing Title, Message, or user IDs"}), 400
 
    notification = Notification(
        title=title, message=message, users=json.dumps(user_ids),sender=username
    )
    db.session.add(notification)
    db.session.commit()
 
    success_count, failure_count, bluboy_id_without_tokens, failing_bluboy_ids = send_notifications(title, message, user_ids,username)
    print("Notification has been inserted and sent successfully.")
    return jsonify(
        {
            "message": "Notification has been inserted and sent successfully.",
            "success_count": success_count,
            "failure_count": failure_count,
            "bluboy_id_without_tokens": bluboy_id_without_tokens,
            "failing_bluboy_ids": failing_bluboy_ids,
            "sent_by": username
        }
    )
 
# Other routes remain unchanged
 
@app.route("/notificationsfetchfromdb", methods=["GET"])
def fetch_notifications():
    print("Fetching notifications from the database")
    notifications = Notification.query.all()
    notifications_list = [
        {
            "notification_id": notification.notification_id,
            "title": notification.title,
            "message": notification.message,
            "users": notification.users,
            "timestamp": notification.timestamp,
        }
        for notification in notifications
    ]
    print("Notifications fetched:", notifications_list)
    return jsonify(notifications_list)
 
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        user = LoginUser.query.filter_by(username=username, password=password).first()
        if user:
            session["username"] = user.username
            return redirect(url_for("option"))
        else:
            return "Invalid credentials, please try again."
    return render_template("login.html")
 
@app.route("/logout")
def logout():
    session.pop("username", None)
    return redirect(url_for("login"))
 
@app.route("/")
def index():
    if "username" not in session:
        return redirect(url_for("login"))
    return render_template("index.html", username=session["username"])
 
@app.route("/selection")
def selection():
    if "username" not in session:
        return redirect(url_for("login"))
    return render_template("selection.html" ,username=session["username"])
 
 
# Sending paginated notifications
 
@app.route('/notifications/all', methods=['POST'])
def start_sending():
    if "username" not in session:
        return redirect(url_for("login"))
    data = request.json
    title = data.get('title')
    message = data.get('message')
    username=session["username"]
   
    thread_id = create_parallel_notifier(title,message,username,userids=[],bluboyids=[])
 
    print(f'Title: {title}, Message: {message}')
    return jsonify({'success': True, 'message': 'Request processed for All','id':thread_id})
 
@app.route('/notifications/bluboyids', methods=['POST'])
def push_bluboy():
    if "username" not in session:
        return redirect(url_for("login"))
    data = request.json
    title = data.get('title')
    message = data.get('message')
    bluboyid = data.get('bluboyid')
    username=session["username"]
 
    thread_id = create_parallel_notifier(title,message,username,userids=[],bluboyids=bluboyid)
    # Process the request for "bluboyid"
    print(f'Title: {title}, Message: {message}, Bluboy IDs: {bluboyid}')
    return jsonify({'success': True, 'message': 'Request processed for Bluboy IDs','id':thread_id})
 
@app.route('/notifications/userids', methods=['POST'])
def push_userid():
    if "username" not in session:
        return redirect(url_for("login"))
    data = request.json
    title = data.get('title')
    message = data.get('message')
    userid = data.get('userid')
    username=session["username"]
   
    thread_id = create_parallel_notifier(title,message,username,userids=userid,bluboyids=[])
    # Process the request for "userid"
    print(f'Title: {title}, Message: {message}, User IDs: {userid}')
   
    return jsonify({
        'success': True,
        'message': 'Request processed for User IDs',
        'id':thread_id
    })
 
 
@app.route("/topic")
def topics():
    if "username" not in session:
        return redirect(url_for("login"))
    return render_template("topics.html", username=session["username"])
 
@app.route("/option")
def option():
    if "username" not in session:
        return redirect(url_for("login"))
    return render_template("options.html", username=session["username"])
 
# TEST FOR SENDING IN PAGINATED MANNER
@app.route("/testPush")
def testPushAll():
    if "username" not in session:
        return jsonify({"error": "Unauthorized access"}), 403
 
    json_data = request.get_json()
    title = json_data["Title"]
    message = json_data["Message"]
    user_ids = json_data["users"]
    username = session["username"]
 
    if not title or not message or not user_ids:
        print("Error: Missing Title, Message, or user IDs")
        return jsonify({"error": "Missing Title, Message, or user IDs"}), 400
 
    notification = Notification(
        title=title, message=message, users=json.dumps(user_ids),sender=username
    )
    db.session.add(notification)
    db.session.commit()
 
    success_count, failure_count, bluboy_id_without_tokens, failing_bluboy_ids = send_notifications(title, message, user_ids,username)
    print("Notification has been inserted and sent successfully.")
    return jsonify(
        {
            "message": "Notification has been inserted and sent successfully.",
            "success_count": success_count,
            "failure_count": failure_count,
            "bluboy_id_without_tokens": bluboy_id_without_tokens,
            "failing_bluboy_ids": failing_bluboy_ids,
            "sent_by": username
        }
    )
 
 
# UNINSTALL TRACKER
 
# Send Tracker Page
@app.route("/test/tracker")
def tracker():
    query = text(
        """
        SELECT count(user_id)
        FROM users u
        """
    )
    result = db.session.execute(query).fetchone()
    num_users = result[0]
 
    query = text(
        """
        SELECT count(u.user_id)
        FROM users u , user_devices ud
        WHERE u.user_id = ud.user_id
        ORDER BY u.user_id
        """
    )
    result = db.session.execute(query).fetchone()
    num_users_with_tokens = result[0]
   
    return jsonify({
        "num_users": num_users,
        "num_users_with_tokens": num_users_with_tokens,
        "num_logged_out": num_users - num_users_with_tokens
    })


#
# #
# ##topics page routes
 
@app.route('/get_topics')
def get_topics_route():
    topics = get_topics()
    return jsonify(topics)
 
@app.route('/send_notification', methods=['POST'])
def send_notification():
    try:
        title = request.form['title']
        message_body = request.form['message']
        topic_name = request.form['topic']
 
        if not title or not message_body or not topic_name:
            return jsonify({"success": False, "error": "Title, message, and topic are required"}), 400
 
        message = messaging.Message(
            notification=messaging.Notification(
                title=title,
                body=message_body,
            ),
            topic=topic_name,
        )
 
        response = messaging.send(message)
        print(f'Successfully sent message to topic {topic_name}: {response}')
 
        # function call for storing into database
        username=session["username"]
        log_notification(topic_name, title, message_body,username)
 
        return jsonify({"success": True, "response": response})
    except Exception as e:
        print(f'Error sending message: {e}')
        return jsonify({"success": False, "error": str(e)}), 500
 
 
@app.route("/test/dictionary",methods=["POST"])
def getResultDictValue():
    json_data = request.get_json()
    thread_id = json_data["id"]
    return jsonify(getResult(thread_id))

@app.route('/uninstalls/results', methods =['GET'])
def get_results_page():
    if "username" not in session:
        return redirect(url_for("login"))
    return render_template("results.html",username = session["username"] )
@app.route('/uninstalled', methods=['GET'])
def get_uninstalled():
    if "username" not in session:
        return redirect(url_for("login"))
    else:

        select_query = text(
                """
                SELECT id,title,message,success_list,logout_list,uninstalled_list,timestamp
                FROM Uninstalled 
                WHERE sender= :sender
                order by (timestamp) desc
                Limit 10
                """
            )
        uninstalled_entries=db.session.execute(select_query, {
            "sender":session["username"],
        })
        
        ordered_entries = [
        {
            'id': entry.id,
            'title': entry.title,
            'message': entry.message,
            'success_list': entry.success_list,
            'logout_list': entry.logout_list,
            'uninstalled_list': entry.uninstalled_list,
            'timestamp': entry.timestamp
        } for entry in uninstalled_entries
        ]
        return jsonify(ordered_entries)
