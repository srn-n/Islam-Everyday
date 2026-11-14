package com.simplymadestudio.islameveryday;

/** The large (4x4) Verse for today: the same content with more room and bigger text. */
public class VerseWidgetLarge extends VerseWidget {
    @Override protected int layout() { return R.layout.widget_verse_large; }
    @Override protected int alarmCode() { return 3; }
}
