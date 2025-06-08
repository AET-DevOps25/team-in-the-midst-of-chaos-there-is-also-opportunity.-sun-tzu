# genai/tests/test_prompts.py

from genai.src.prompts.transition_prompts import (
    build_song_details_string,
    get_introduction_prompt,
    get_quick_transition_prompt,
    COMMON_DJ_SYSTEM_MESSAGE_DEFAULT
)
from langchain_core.prompts import (
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate
)


# --- Tests for _build_song_details_string ---

def test_build_song_details_string_with_all_info():
    assert build_song_details_string("Song A", "Artist A") == '"Song A" by Artist A'


def test_build_song_details_string_with_title_only():
    assert build_song_details_string("Song B", None) == '"Song B"'


def test_build_song_details_string_with_empty_artist():
    assert build_song_details_string("Song C", "") == '"Song C"'


def test_build_song_details_string_with_no_title():
    assert build_song_details_string(None, "Artist D") == ""
    assert build_song_details_string("", "Artist D") == ""


# --- Tests for get_introduction_prompt ---

def test_get_introduction_prompt_with_artist():
    next_song = {"title": "Next Hit", "artist": "Future Star"}
    dj = "DJ Gen"
    prompt_template = get_introduction_prompt(next_song_data=next_song, dj_name=dj)

    assert isinstance(prompt_template, ChatPromptTemplate)
    assert len(prompt_template.messages) == 2
    assert isinstance(prompt_template.messages[0], SystemMessagePromptTemplate)
    assert prompt_template.messages[0].prompt.template == COMMON_DJ_SYSTEM_MESSAGE_DEFAULT

    assert isinstance(prompt_template.messages[1], HumanMessagePromptTemplate)
    expected_human_message = (
        f'The next song is "Next Hit" by Future Star. '
        f'As {dj}, please write a suitable and engaging introduction for this song. Welcome the listeners.'
    )
    assert prompt_template.messages[1].prompt.template == expected_human_message


def test_get_introduction_prompt_title_only():
    next_song = {"title": "Solo Track"}
    dj = "DJ AI"
    prompt_template = get_introduction_prompt(next_song_data=next_song, dj_name=dj)

    expected_human_message = (
        f'The next song is "Solo Track". '
        f'As {dj}, please write a suitable and engaging introduction for this song. Welcome the listeners.'
    )
    assert prompt_template.messages[1].prompt.template == expected_human_message


def test_get_introduction_prompt_no_title():
    next_song = {"artist": "Some Artist"}  # Title missing
    dj = "DJ Bot"
    prompt_template = get_introduction_prompt(next_song_data=next_song, dj_name=dj)

    expected_human_message = f"Please write a generic welcome message for the show, {dj}."
    assert prompt_template.messages[1].prompt.template == expected_human_message


# --- Tests for get_quick_transition_prompt ---

def test_get_quick_transition_all_info():
    prev = {"title": "Old Song", "artist": "Old Artist"}
    next_s = {"title": "New Tune", "artist": "New Artist"}
    after_next = {"title": "Future Hit", "artist": "Next Gen"}
    prompt_template = get_quick_transition_prompt(prev, next_s, after_next)

    expected_human_parts = [
        'That was "Old Song" by Old Artist.',
        'Next up is "New Tune" by New Artist.',
        'And after that, we\'ll hear "Future Hit" by Next Gen.',
        '\nWhat do you say as a transition? Please provide only the pure transition text, without any additional greetings or sign-offs from you as the DJ. The song will follow immediately.'
    ]
    expected_human_message = " ".join(expected_human_parts)
    assert prompt_template.messages[1].prompt.template == expected_human_message
    assert prompt_template.messages[0].prompt.template == COMMON_DJ_SYSTEM_MESSAGE_DEFAULT


def test_get_quick_transition_no_after_next():
    prev = {"title": "Song X", "artist": "Artist X"}
    next_s = {"title": "Song Y", "artist": "Artist Y"}
    prompt_template = get_quick_transition_prompt(prev, next_s, None)  # after_next_song_data is None

    expected_human_parts = [
        'That was "Song X" by Artist X.',
        'Next up is "Song Y" by Artist Y.',
        # No "And after that..." part
        '\nWhat do you say as a transition? Please provide only the pure transition text, without any additional greetings or sign-offs from you as the DJ. The song will follow immediately.'
    ]
    expected_human_message = " ".join(expected_human_parts)
    assert prompt_template.messages[1].prompt.template == expected_human_message


def test_get_quick_transition_artists_missing():
    prev = {"title": "Track 1"}
    next_s = {"title": "Track 2"}
    after_next = {"title": "Track 3"}  # Artist missing for after_next as well
    prompt_template = get_quick_transition_prompt(prev, next_s, after_next)

    expected_human_parts = [
        'That was "Track 1".',
        'Next up is "Track 2".',
        'And after that, we\'ll hear "Track 3".',
        '\nWhat do you say as a transition? Please provide only the pure transition text, without any additional greetings or sign-offs from you as the DJ. The song will follow immediately.'
    ]
    expected_human_message = " ".join(expected_human_parts)
    assert prompt_template.messages[1].prompt.template == expected_human_message


def test_get_quick_transition_prev_title_missing_graceful():
    # Though the logic expects prev_title, let's see if it handles it (it should just omit the "That was..." part)
    prev = {"artist": "Artist Unknown"}  # Title missing
    next_s = {"title": "Main Song", "artist": "Main Artist"}
    prompt_template = get_quick_transition_prompt(prev, next_s)

    expected_human_parts = [
        # "That was..." part should be missing as prev_title is None
        'Next up is "Main Song" by Main Artist.',
        '\nWhat do you say as a transition? Please provide only the pure transition text, without any additional greetings or sign-offs from you as the DJ. The song will follow immediately.'
    ]
    # Need to call join with filter(None,...) to handle potential empty strings from omitted parts
    expected_human_message = " ".join(filter(None, expected_human_parts))
    assert prompt_template.messages[1].prompt.template == expected_human_message