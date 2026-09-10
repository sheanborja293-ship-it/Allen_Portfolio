"""Serve the HTML pages and process the contact form. Page content lives in templates/."""
import os
import re
import secrets
from collections import deque
from pathlib import Path

from flask import Flask, render_template, request, redirect, url_for, flash, session, send_from_directory

app = Flask(__name__)
app.config.update(
    SECRET_KEY=os.environ.get('SECRET_KEY') or secrets.token_hex(32),
    MAX_CONTENT_LENGTH=32 * 1024,
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE='Lax',
)
# Development inbox only: messages are cleared when the server restarts.
messages = deque(maxlen=100)


def deliver_message(message):
    """Keep a non-JavaScript fallback submission in the temporary demo inbox."""
    messages.append(message)


# These routes serve complete HTML files without template inheritance.

@app.get('/')
def index():
    return send_from_directory(Path(app.root_path, 'templates'), 'index.html')


@app.get('/about')
def about():
    return send_from_directory(Path(app.root_path, 'templates'), 'about.html')


@app.get('/skills')
def skills():
    return send_from_directory(Path(app.root_path, 'templates'), 'skills.html')


@app.get('/projects')
def projects():
    return send_from_directory(Path(app.root_path, 'templates'), 'projects.html')


@app.route('/contact', methods=['GET', 'POST'])
def contact():
    # Only this page needs dynamic form values, feedback, and a security token.
    session.setdefault('csrf_token', secrets.token_urlsafe(32))
    values = {}
    if request.method == 'POST':
        values = {key: request.form.get(key, '').strip() for key in ('name', 'email', 'subject', 'message')}
        if not session.get('csrf_token') or not secrets.compare_digest(request.form.get('csrf_token', ''), session['csrf_token']):
            flash('Your form expired. Please try again.', 'error')
            return render_template('contact.html', values=values), 400
        if not all(values.values()):
            flash('Please complete every field.', 'error')
        elif not re.fullmatch(r'[^\s@]+@[^\s@]+\.[^\s@]+', values['email']):
            flash('Please enter a valid email address.', 'error')
        elif any(len(values[k]) > limit for k, limit in [('name', 100), ('email', 254), ('subject', 150), ('message', 5000)]):
            flash('Your message is too long. Please check the field limits.', 'error')
        else:
            deliver_message(values)
            flash('Message saved. To email me directly, use the contact email link.', 'success')
            return redirect(url_for('contact'))
        return render_template('contact.html', values=values), 400
    return render_template('contact.html', values=values)


@app.get('/resume')
def resume():
    if Path(app.static_folder, 'files', 'resume.pdf').is_file():
        return send_from_directory(Path(app.static_folder, 'files'), 'resume.pdf', as_attachment=True)
    flash('My résumé is being updated. Please get in touch for more information.', 'info')
    return redirect(url_for('contact'))


@app.errorhandler(404)
def not_found(error):
    return send_from_directory(Path(app.root_path, 'templates'), '404.html'), 404


if __name__ == '__main__':
    app.run(debug=True)
