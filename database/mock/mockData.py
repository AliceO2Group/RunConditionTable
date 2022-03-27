#!/usr/bin/env python
# coding: utf-8

# https://pythonhosted.org/jupyter_runner/

# In[1]:


import os
import sys

cachedDirPath = "./cached/"
if os.environ.get('RCT_MOCKDATA_GENERATOR_DEL_CACHE') == 'true':
    os.system("rm -rf cached >/dev/null 2>&1")
os.system("mkdir -p cached >/dev/null 2>&1")

# In[2]:


RCT_USER = os.environ.get('RCT_USER')
RCT_PASSWORD = os.environ.get('RCT_PASSWORD')
RCT_DATABASE = os.environ.get('RCT_DATABASE')
RCT_DATABASE_HOST = os.environ.get('RCT_DATABASE_HOST')


# In[3]:


os.system(sys.executable + " -m pip install pandas")
os.system(sys.executable + " -m pip install numpy")


# In[4]:


import pandas as pd
import numpy as np
import re
from collections import defaultdict
from numpy.random import randint, uniform, choice


# In[5]:


gen_rand_letter = lambda: chr(np.random.randint(ord('a'), ord('z')))
gen_rand_char = lambda: chr(np.random.randint(ord('a'), ord('z')))
gen_rand_string = lambda n: ''.join([gen_rand_char() for _ in range(n)])


# In[6]:


print("creating tables")


# In[15]:


def read_csv(path):
    return pd.read_csv(path, index_col=0)


# # Beam directory

# In[16]:


cached_beams_dictionary_df_path = cachedDirPath + "beams_dictionary_df"

beams_types = ['PbPb', 'pp', 'pPb', 'nn', 'np']
beams_dictionary = [(i, bt) for i, bt in enumerate(beams_types)]

if not os.path.exists(cached_beams_dictionary_df_path):
    beams_dictionary_df = pd.DataFrame(beams_dictionary)
    beams_dictionary_df.rename(columns=
                                    {0:'id',
                                    1:'beam_type',
                                    }, inplace=True)
    beams_dictionary_df.to_csv(cached_beams_dictionary_df_path)
else:
    beams_dictionary_df = read_csv(cached_beams_dictionary_df_path)

beams_dictionary_df


# # Periods

# In[17]:


cached_periods_df_path = cachedDirPath + "periods_df"

size = 50
years = [str(y) for y in range(2010, 2020)]
periods_names = np.unique([f'LHC{choice(years)}{gen_rand_letter()}' for i in range(size)])
beams_types_id = [randint(0, len(beams_types)) for _ in range(len(periods_names))]

if not os.path.exists(cached_periods_df_path):
    periods = [(i, n[:3] + n[5:], int(n[3:7]), t) for (i, (n, t)) in enumerate(zip(periods_names, beams_types_id))]
    periods_df = pd.DataFrame(periods)
    periods_df.rename(columns=
                            {0: 'id',
                            1: 'name',
                            2: 'year',
                            3: 'beam_type_id'}, inplace=True)
    periods_df.to_csv(cached_periods_df_path)
else:
    periods_df = read_csv(cached_periods_df_path)

periods_df[:10]


# # Runs

# In[ ]:


gen_B_field = lambda: f'{choice(["+", "-"])}{uniform(0, 2):.7} T'


# In[ ]:


cached_runs_df_path = cachedDirPath + "runs_df"

if not os.path.exists(cached_runs_df_path):
    runs = [np.unique(randint(
                                    pi*1000,
                                    (pi+1)*1000,
                                    np.random.randint(50, 200)))
                    for pi in range(len(periods_names))]
    runTypes = ['technical', 'data', 'cosmic', 'callibration', 'sim']
    energyForPeriodsRuns = dict([(i, randint(500, 1500)) for i in range(len(periods_names))])
    runs_df = pd.DataFrame([
                        (
                      -1, 
                      pi,
                      run_number,
                      randint(1000, 10000),
                      randint(10000, 100000),
                      gen_B_field(),
                      energyForPeriodsRuns[pi],
                      f'IR-{gen_rand_string(5)}',
                      randint(12345, 23456), 
                      f'trigg_conf-{gen_rand_string(5)}', 
                      randint(123456, 234567), 
                      choice(runTypes),
                      f'mu-{gen_rand_string(6)}', 
                      randint(1000000000000,5999999999999), 
                      randint(6000000000000,9999999999999)
                    ) for pi, runs in enumerate(runs)
                        for run_number in runs
                    ])

    runs_df.rename(columns=
                            {0: 'id',
                            1: 'period_id',
                            2: 'run_number',
                            3: 'start',
                            4: 'end',
                            5: 'B_field',
                            6: 'energy_per_beam',
                            7: 'IR',
                            8: 'filling_scheme',
                            9: 'triggers_conf',
                            10: 'fill_number',
                            11: 'runType',
                            12: 'mu',
                            13: 'timeTrgStart',
                            14: 'timeTrgEnd'}, inplace=True)
    runs_df['id'] = pd.Series(range(0, len(runs_df)))
    
    runs_df.to_csv(cached_runs_df_path)
else:
    runs_df = read_csv(cached_runs_df_path)
  
runs_df


# # Data Passess

# ### pass_types

# In[ ]:


cached_pass_types_df_path = cachedDirPath + "pass_types_df"

if not os.path.exists(cached_pass_types_df_path):
    pass_types = ['technical', 'data', 'calibration']
    pass_types = [(i, bt) for i, bt in enumerate(pass_types)]
    pass_types_df = pd.DataFrame(pass_types)
    pass_types_df.rename(columns=
                                    {0:'id',
                                    1:'pass_type',
                                    }, inplace=True)

    pass_types_df.to_csv(cached_pass_types_df_path)
else:
    pass_types_df = read_csv(cached_pass_types_df_path)
    
pass_types_df


# ### data_passes

# In[ ]:


cached_data_passes_df_path = cachedDirPath + "data_passes_df"


if not os.path.exists(cached_data_passes_df_path):
    data_passes_names = [choice(periods_names) + '__' + gen_rand_string(10) for _ in range(150)]
    data_passes_df = pd.DataFrame([
        (i,
        n, 
        choice(['dec', '']), 
        randint(0, len(pass_types)),
        choice(['jira-', '']),
        choice(['ML-', '']),
        randint(10, 100), 
        f'sof-v.{randint(5)}.{randint(5)}-{gen_rand_string(2)}',
        123456
        ) for i, n in enumerate(data_passes_names)
    ])
    data_passes_df.rename(columns={
        0: 'id',
        1: 'name',
        2: 'description',
        3: 'pass_type',
        4: 'jira',
        5: 'ML',
        6: 'number_of_events',
        7: 'software_version',
        8: 'size'
    }, inplace=True)

    data_passes_df.to_csv(cached_data_passes_df_path)
else:
    data_passes_df = read_csv(cached_data_passes_df_path)

data_passes_df



# ### data_passes_runs

# In[ ]:


cached_data_passes_runs_path = cachedDirPath + "data_passes_runs"

if not os.path.exists(cached_data_passes_runs_path):
    data_passes_runs = [runs_df['id'].sample(n=randint(10, 100), replace=False).unique()
                        for an in range(len(data_passes_df))]
    data_passes_runs_df = pd.DataFrame([
        (-1,
        prod_id,
        run_id
        )
        for prod_id, rs in enumerate(data_passes_runs)
            for run_id in rs
    ])
    data_passes_runs_df.rename(columns=
                            {0: 'id',
                                1: 'production_id',
                                2: 'run_id'
                            }, inplace=True)
    data_passes_runs_df['id'] = pd.Series(range(len(data_passes_runs_df)))

    data_passes_runs_df.to_csv(cached_data_passes_runs_path)
else:
    data_passes_runs_df = read_csv(cached_data_passes_runs_path)

data_passes_runs_df


# # Sim passes

# ### simulation_passes

# In[ ]:



cached_simulation_passes_df_path = cachedDirPath + "simulation_passes_df"

if not os.path.exists(cached_simulation_passes_df_path):
    simulation_passes_names = [choice(periods_names) + '__' + gen_rand_string(10) for _ in range(150)]
    simulation_passes_df = pd.DataFrame([
        (i,
        n, 
        choice(['dec', '']), 
        choice(['jira-??', '']),
        choice(['ML-??', '']),
        f'PWG-{gen_rand_string(10)}', 
        randint(10, 100)
        ) for i, n in enumerate(simulation_passes_names)
    ])
    simulation_passes_df.rename(columns={
        0: 'id',
        1: 'name',
        2: 'description',
        3: 'jira',
        4: 'ML',
        5: 'PWG',
        6: 'number_of_events'
    }, inplace=True)

    simulation_passes_df.to_csv(cached_simulation_passes_df_path)
else:
    simulation_passes_df = read_csv(cached_simulation_passes_df_path)

simulation_passes_df


# ### simulation_passes_runs

# In[ ]:


cached_simulation_passes_runs_path = cachedDirPath + "simulation_passes_runs"

if not os.path.exists(cached_simulation_passes_runs_path):
    simulation_passes_runs = [runs_df['id']
                            .sample(n=randint(10, 100), replace=False)
                            .unique() for an in range(len(simulation_passes_df))
                            ]
    simulation_passes_runs_df = pd.DataFrame([
        (-1,
        prod_id,
        run_id
        )
        for prod_id, rs in enumerate(simulation_passes_runs)
            for run_id in rs
    ])
    simulation_passes_runs_df.rename(columns=
                            {0: 'id',
                                1: 'simulation_pass_id',
                                2: 'run_id'
                            }, inplace=True)
    simulation_passes_runs_df['id'] = pd.Series(range(len(simulation_passes_runs_df)))

    simulation_passes_runs_df.to_csv(cached_simulation_passes_runs_path)
else:
    simulation_passes_runs_df = read_csv(cached_simulation_passes_runs_path)
simulation_passes_runs_df


# ### detectors_subsystems

# In[ ]:


cached_detectors_subsystems_df_path = cachedDirPath + "detectors_subsystems_df"

if not os.path.exists(cached_detectors_subsystems_df_path):
    detectors_names = ['CPV', 'EMC', 'FDD', 'FT0', 'FV0', 'HMP', 'ITS', 'MCH', 'MFT', 'MID', 'PHS', 'TOF', 'TPC', 'TRD', 'ZDC']
    detectors_subsystems = [(i, n) for i, n in enumerate(detectors_names)]
    detectors_subsystems_df = pd.DataFrame(detectors_subsystems)
    detectors_subsystems_df.rename(columns=
                                {0: 'id',
                                    1: 'name'}, inplace=True)


    detectors_subsystems_df.to_csv(cached_detectors_subsystems_df_path)
else:
    detectors_subsystems_df = read_csv(cached_detectors_subsystems_df_path)

detectors_subsystems_df


# ### runs_detectors

# In[ ]:


cached_runs_detectors_df_path = cachedDirPath + "runs_detectors_df"

if not os.path.exists(cached_runs_detectors_df_path):
    runs_detectors = [(
                    run_id, 
                    choice(list(range(len(detectors_subsystems_df))),
                            replace=False,
                            size=randint(1, len(detectors_subsystems_df)))
                    ) for run_id in range(len(runs_df))]
    runs_detectors_df = pd.DataFrame([(-1,
                                    run_id,
                                    detector_id)
                                    for run_id, an in runs_detectors
                                        for detector_id in an
                                    ])
    runs_detectors_df.rename(columns={
        0: 'id',
        1: 'run_id',
        2: 'detector_id'}, inplace=True)
    runs_detectors_df['id'] = pd.Series(range(len(runs_detectors_df)))


    runs_detectors_df.to_csv(cached_runs_detectors_df_path)
else:
    runs_detectors_df = read_csv(cached_runs_detectors_df_path)

runs_detectors_df


# ### flags_dictionary

# In[ ]:


cached_flags_dictionary_df_path = cachedDirPath + "flags_dictionary_df"

if not os.path.exists(cached_flags_dictionary_df_path):
    flags = ['ok', 'good', 'noise', 'dist', 'harm', 'chaotic', 'clear', 'heh']
    flags_dictionary = [(i, f) for i, f in enumerate(flags)]
    flags_dictionary_df = pd.DataFrame(flags_dictionary)
    flags_dictionary_df.rename(columns={0: 'id', 1: 'flag'}, inplace=True)

    flags_dictionary_df.to_csv(cached_flags_dictionary_df_path)
else:
    flags_dictionary_df = read_csv(cached_flags_dictionary_df_path)
flags_dictionary_df


# ### quality_control_flags

# In[ ]:



cached_quality_control_flags_df_path = cachedDirPath + "quality_control_flags_df"

if not os.path.exists(cached_quality_control_flags_df_path):
    quality_control_flags_df = pd.merge(data_passes_runs_df.rename(columns={'id':'pass_run_id'}),
                                runs_detectors_df.rename(columns={'id':'run_detector_id'}),
                                how='inner',
                                on='run_id')
    quality_control_flags_df.drop(columns=['production_id', 'detector_id', 'run_id'], inplace=True)
    quality_control_flags_df['start'] = pd.Series([randint(1000000, 5999999)
                                            for _ in range(len(quality_control_flags_df))])
    quality_control_flags_df['end'] = pd.Series([randint(6000000, 9999999)
                                            for _ in range(len(quality_control_flags_df))])

    quality_control_flags_df['flag_type_id'] = pd.Series([flags_dictionary_df['id'].sample().iloc[0]
                                                    for _ in range(len(quality_control_flags_df))])

    quality_control_flags_df['id'] = pd.Series(range(len(quality_control_flags_df)))
    quality_control_flags_df['comment'] = pd.Series([choice(['', 'cc'], p=[0.6, 0.4])
                                                    for _ in range(len(quality_control_flags_df))])


    quality_control_flags_df.to_csv(cached_quality_control_flags_df_path)
else:
    quality_control_flags_df = read_csv(cached_quality_control_flags_df_path)
    
quality_control_flags_df


# # Inserting

# In[ ]:


os.system(sys.executable + " -m pip install psycopg2-binary")
import psycopg2 as pypg


# In[ ]:


connection = pypg.connect(host=RCT_DATABASE_HOST,
                          user=RCT_USER,
                          dbname=RCT_DATABASE,
                          password=RCT_PASSWORD)
cur = connection.cursor()


# In[ ]:


import string

def isfloat(s):
    b = True
    try:
        float(s)
    except Exception as e:
        b = False
    return b

def insert_row(row, targetTableName, counter, logExceptions, logstep=1000):
    selectors_stm = "(\"id\", \"" + "\", \"".join(row.index) + "\")"
    values = [str(a) for a in row]
    values_list = "(DEFAULT, " + ", ".join([s if isfloat(s) else f"\'{s}\'" for s in values])+ ")"

    command = f"INSERT INTO {targetTableName} {selectors_stm} VALUES {values_list}"
    try:
        cur.execute(command)
        connection.commit()
        counter[0] += 1
    except Exception as e:
        if logExceptions:
            print('')
            print(e)
            print(f'inserting to table {targetTableName} {counter}', end='\x1b\r')
        connection.rollback()       
    counter[1] += 1
    if counter[0] % logstep:
        print(f'inserting to table {targetTableName} {counter}', end='\x1b\r')
        
def insert_table_row_by_row(df: pd.DataFrame, targetTableName: str, logExceptions=True):
    counter = [0, 0]
    print(f'inserting to table {targetTableName} {counter}', end='\x1b\r')
    df.drop(columns=['id']).apply(lambda r:
                                      insert_row(r, targetTableName, counter, logExceptions),
                                  axis=1)
    print(f'inserting to table {targetTableName} {counter}')


# In[ ]:


tablesAndNames = [(beams_dictionary_df, 'beams_dictionary'),
                  (periods_df, 'periods'),
                  
                  (runs_df, 'runs'),
                  
                  (pass_types_df, 'pass_types'),
                  (data_passes_df, 'data_passes'),
                  (data_passes_runs_df, 'data_passes_runs'),
                  
                  (simulation_passes_df, 'simulation_passes'),
                  (simulation_passes_runs_df, 'simulation_passes_runs'),
                  
                  (detectors_subsystems_df, 'detectors_subsystems'),
                  (runs_detectors_df, 'runs_detectors'),
                  
                  (flags_dictionary_df, 'flags_types_dictionary'),
                  (quality_control_flags_df, 'quality_control_flags')
                 ]

for (t, n) in tablesAndNames:
    print(f'inserting table {n}')
    insert_table_row_by_row(t, n, logExceptions=False)
    print(f'table {n} inserted')


# In[ ]:




