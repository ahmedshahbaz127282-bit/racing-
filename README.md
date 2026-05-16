<?xml version="1.0" encoding="utf-8"?>
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="#000000">

    <com.yourpackage.RaceView
        android:id="@+id/raceView"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_gravity="bottom"
        android:orientation="horizontal"
        android:padding="16dp">

        <Button
            android:id="@+id/btnLeft"
            android:layout_width="0dp"
            android:layout_height="80dp"
            android:layout_weight="1"
            android:text="⬅ LEFT"
            android:textSize="18sp"/>

        <Button
            android:id="@+id/btnRight"
            android:layout_width="0dp"
            android:layout_height="80dp"
            android:layout_weight="1"
            android:text="RIGHT ➡"
            android:textSize="18sp"/>
    </LinearLayout>

</FrameLayout>
