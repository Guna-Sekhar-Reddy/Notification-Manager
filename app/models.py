from . import db
 
class User(db.Model):
    __tablename__ = "users"
    user_id = db.Column(db.BigInteger, primary_key=True, nullable=False)
    player_name = db.Column(db.String(255), nullable=False)
    bluboy_id = db.Column(db.String(25), nullable=False)
 
class UserDevice(db.Model):
    __tablename__ = "user_devices"
    device_id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    user_id = db.Column(db.BigInteger, nullable=True)
    auth_key = db.Column(db.String(120), nullable=True)
    socket_id = db.Column(db.String(255), nullable=True)
    device_token = db.Column(db.Text, nullable=True)
    device_type = db.Column(db.Enum("A", "I"), default="A", nullable=False)
    device_name = db.Column(db.String(60), nullable=False)
    device_unique_id = db.Column(db.String(60), nullable=False)
    app_version = db.Column(db.String(12), nullable=False)
    is_root = db.Column(db.Enum("Y", "N"), default="N", nullable=False)
    ip_address = db.Column(db.String(120), nullable=False)
    created_at = db.Column(db.BigInteger, nullable=True)
    updated_at = db.Column(db.BigInteger, nullable=True)
    device_os_version = db.Column(db.String(60), nullable=True)
    device_idfa = db.Column(db.String(60), nullable=True)
    device_idfv = db.Column(db.String(60), nullable=True)
    created_dt = db.Column(
        db.TIMESTAMP, default=db.func.current_timestamp(), nullable=False
    )
    updated_dt = db.Column(
        db.TIMESTAMP,
        default=db.func.current_timestamp(),
        onupdate=db.func.current_timestamp(),
        nullable=False,
    )
 
class Templates(db.Model):
    __tablename__ = "template"
    title = db.Column(db.String(20), primary_key=True)
    message = db.Column(db.String(100), unique=True, nullable=False)
 
class Notification(db.Model):
    __tablename__ = "notifications"
    notification_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    message = db.Column(db.Text, nullable=False)
    users = db.Column(db.JSON, nullable=False)
    sender=db.Column(db.String(255), nullable=False)
    timestamp = db.Column(
        db.TIMESTAMP, server_default=db.func.current_timestamp(), nullable=False
    )
class LoginUser(db.Model):
    __tablename__ = "login_users"
    id = db.Column(db.Integer, primary_key=True,autoincrement=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)


class Uninstalled(db.Model):
    __tablename__ = 'Uninstalled'
    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100))
    message = db.Column(db.String(300))
    success_list = db.Column(db.JSON)
    logout_list = db.Column(db.JSON)
    uninstalled_list = db.Column(db.JSON)
    sender = db.Column(db.String(30))
    timestamp = db.Column(db.TIMESTAMP, default=db.func.current_timestamp())

